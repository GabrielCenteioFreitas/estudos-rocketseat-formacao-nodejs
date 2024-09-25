import { NotAllowedError } from "@/core/errors/use-cases/not-allowed-error";
import { ResourceNotFoundError } from "@/core/errors/use-cases/resource-not-found-error";
import { makeAdmin } from "test/factories/make-admin";
import { makeDeliveryMan } from "test/factories/make-delivery-man";
import { makeOrder } from "test/factories/make-order";
import { InMemoryAdminsRepository } from "test/repositories/in-memory-admins-repository";
import { InMemoryDeliveryMenRepository } from "test/repositories/in-memory-delivery-men-repository";
import { InMemoryOrdersRepository } from "test/repositories/in-memory-orders-repository";
import { InMemoryRecipientsRepository } from "test/repositories/in-memory-recipients-repository";
import { FetchDeliveryManOrdersUseCase } from "./fetch-delivery-man-orders";
import { makeRecipient } from "test/factories/make-recipient";
import { FetchNearbyOrdersUseCase } from "./fetch-nearby-orders";
import { Location } from "../../enterprise/entities/value-objects/location";

let ordersRepository: InMemoryOrdersRepository;
let recipientsRepository: InMemoryRecipientsRepository;
let deliveryMenRepository: InMemoryDeliveryMenRepository;
let sut: FetchNearbyOrdersUseCase;

describe('Fetch delivery man orders - Use Case', () => {
  beforeEach(() => {
    recipientsRepository = new InMemoryRecipientsRepository()
    ordersRepository = new InMemoryOrdersRepository(recipientsRepository)
    deliveryMenRepository = new InMemoryDeliveryMenRepository()
    sut = new FetchNearbyOrdersUseCase(
      ordersRepository,
      deliveryMenRepository,
    )
  })

  it('should be able to fetch nearby orders', async () => {
    const deliveryMan = makeDeliveryMan({
      location: Location.create({
        latitude: -9.8793563,
        longitude: -59.6120217,
      })
    })
    deliveryMenRepository.create(deliveryMan)

    for (let i = 1; i <= 5; i++) {
      const recipient = makeRecipient({
        name: `Recipient ${i}`,
        location: Location.create({
          latitude: -9.8793563,
          longitude: -59.6120217,
        })
      })

      recipientsRepository.create(recipient)

      const order = makeOrder({
        title: `Order 1.${i}`,
        deliveryManId: deliveryMan.id,
        recipientId: recipient.id,
      })

      ordersRepository.create(order)
    }

    for (let i = 1; i <= 5; i++) {
      const recipient = makeRecipient({
        name: `Recipient ${i}`,
        location: Location.create({
          latitude: 0,
          longitude: 0,
        })
      })

      recipientsRepository.create(recipient)

      const order = makeOrder({
        title: `Order 2.${i}`,
        deliveryManId: deliveryMan.id,
        recipientId: recipient.id,
      })

      ordersRepository.create(order)
    }

    const result = await sut.execute({
      authorId: deliveryMan.id.toString(),
      deliveryManId: deliveryMan.id.toString(),
    })

    expect(result.isRight()).toBe(true)
    if (!('orders' in result.value)) {
      throw new Error()
    }
    expect(result.value.orders).toHaveLength(5)
    expect(result.value.orders).toEqual(expect.arrayContaining([
      expect.objectContaining({
        title: 'Order 1.1',
      }),
      expect.objectContaining({
        title: 'Order 1.5',
      }),
    ]))
  })

  it('should not be able to get a delivery man orders from another delivery man', async () => {
    const [deliveryMan01, deliveryMan02] = [
      makeDeliveryMan(),
      makeDeliveryMan(),
    ]
    deliveryMenRepository.create(deliveryMan01)
    deliveryMenRepository.create(deliveryMan02)

    const result1 = await sut.execute({
      authorId: deliveryMan02.id.toString(),
      deliveryManId: deliveryMan01.id.toString(),
    })

    expect(result1.isLeft()).toBe(true)
    expect(result1.value).toBeInstanceOf(NotAllowedError)
  })

  it('should not be able to get a delivery man orders not being a recipient', async () => {
    const deliveryMan = makeDeliveryMan()
    deliveryMenRepository.create(deliveryMan)

    const recipient = makeRecipient()
    recipientsRepository.create(recipient)

    const result1 = await sut.execute({
      authorId: recipient.id.toString(),
      deliveryManId: deliveryMan.id.toString(),
    })

    expect(result1.isLeft()).toBe(true)
    expect(result1.value).toBeInstanceOf(NotAllowedError)
  })

  it('should not be able to get a inexistent delivery man orders', async () => {
    const result1 = await sut.execute({
      authorId: 'non-existing-id',
      deliveryManId: 'non-existing-id',
    })

    expect(result1.isLeft()).toBe(true)
    expect(result1.value).toBeInstanceOf(ResourceNotFoundError)
  })
})