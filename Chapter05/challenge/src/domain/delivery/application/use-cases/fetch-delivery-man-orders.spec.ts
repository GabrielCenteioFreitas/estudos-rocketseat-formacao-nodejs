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

let ordersRepository: InMemoryOrdersRepository;
let recipientsRepository: InMemoryRecipientsRepository;
let adminsRepository: InMemoryAdminsRepository;
let deliveryMenRepository: InMemoryDeliveryMenRepository;
let sut: FetchDeliveryManOrdersUseCase;

describe('Fetch delivery man orders - Use Case', () => {
  beforeEach(() => {
    recipientsRepository = new InMemoryRecipientsRepository()
    ordersRepository = new InMemoryOrdersRepository(recipientsRepository)
    deliveryMenRepository = new InMemoryDeliveryMenRepository()
    adminsRepository = new InMemoryAdminsRepository()
    sut = new FetchDeliveryManOrdersUseCase(
      ordersRepository,
      adminsRepository,
      deliveryMenRepository,
    )
  })

  it('should be able to get delivery man orders', async () => {
    const deliveryMan = makeDeliveryMan()
    deliveryMenRepository.create(deliveryMan)

    for (let i = 1; i <= 10; i++) {
      const recipient = makeRecipient({
        name: `Recipient ${i}`,
      })

      recipientsRepository.create(recipient)

      const order = makeOrder({
        title: `Order ${i}`,
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
    expect(result.value).toMatchObject({
      orders: expect.arrayContaining([
        expect.objectContaining({
          title: 'Order 1',
          recipient: 'Recipient 1',
        }),
        expect.objectContaining({
          title: 'Order 2',
          recipient: 'Recipient 2',
        }),
      ])
    })
  })

  it('should be able to get delivery man orders being an admin', async () => {
    const admin = makeAdmin()
    adminsRepository.create(admin)

    const deliveryMan = makeDeliveryMan()
    deliveryMenRepository.create(deliveryMan)

    for (let i = 1; i <= 10; i++) {
      const recipient = makeRecipient({
        name: `Recipient ${i}`,
      })

      recipientsRepository.create(recipient)

      const order = makeOrder({
        title: `Order ${i}`,
        deliveryManId: deliveryMan.id,
        recipientId: recipient.id,
      })

      ordersRepository.create(order)
    }

    const result = await sut.execute({
      authorId: admin.id.toString(),
      deliveryManId: deliveryMan.id.toString(),
    })

    expect(result.isRight()).toBe(true)
    expect(result.value).toMatchObject({
      orders: expect.arrayContaining([
        expect.objectContaining({
          title: 'Order 1',
          recipient: 'Recipient 1',
        }),
        expect.objectContaining({
          title: 'Order 2',
          recipient: 'Recipient 2',
        }),
      ])
    })
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

  it('should not be able to get a delivery man orders being a recipient', async () => {
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
    const deliveryMan = makeDeliveryMan()
    deliveryMenRepository.create(deliveryMan)

    const result1 = await sut.execute({
      authorId: deliveryMan.id.toString(),
      deliveryManId: 'non-existing-id',
    })

    expect(result1.isLeft()).toBe(true)
    expect(result1.value).toBeInstanceOf(ResourceNotFoundError)
  })
})