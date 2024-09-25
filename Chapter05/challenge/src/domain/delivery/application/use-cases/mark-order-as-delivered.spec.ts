import { NotAllowedError } from "@/core/errors/use-cases/not-allowed-error";
import { ResourceNotFoundError } from "@/core/errors/use-cases/resource-not-found-error";
import { makeDeliveryMan } from "test/factories/make-delivery-man";
import { makeOrder } from "test/factories/make-order";
import { makeRecipient } from "test/factories/make-recipient";
import { InMemoryDeliveryMenRepository } from "test/repositories/in-memory-delivery-men-repository";
import { InMemoryOrdersRepository } from "test/repositories/in-memory-orders-repository";
import { InMemoryRecipientsRepository } from "test/repositories/in-memory-recipients-repository";
import { OrderStatus } from "../../enterprise/entities/value-objects/order-status";
import { MarkOrderAsDeliveredUseCase } from "./mark-order-as-delivered";

let ordersRepository: InMemoryOrdersRepository;
let recipientsRepository: InMemoryRecipientsRepository;
let deliveryMenRepository: InMemoryDeliveryMenRepository;
let sut: MarkOrderAsDeliveredUseCase;

describe('Mark order as delivered - Use Case', () => {
  beforeEach(() => {
    recipientsRepository = new InMemoryRecipientsRepository()
    ordersRepository = new InMemoryOrdersRepository(recipientsRepository)
    deliveryMenRepository = new InMemoryDeliveryMenRepository()
    sut = new MarkOrderAsDeliveredUseCase(
      ordersRepository,
      deliveryMenRepository,
    )
  })

  it('should be able to mark a order as delivered', async () => {
    const deliveryMan = makeDeliveryMan()
    deliveryMenRepository.create(deliveryMan)

    const recipient = makeRecipient()
    recipientsRepository.create(recipient)

    const order = makeOrder({
      recipientId: recipient.id,
      deliveryManId: deliveryMan.id,
    })
    ordersRepository.create(order)

    const result = await sut.execute({
      authorId: deliveryMan.id.toString(),
      orderId: order.id.toString(),
      deliveryPhotoUrl: 'fake-delivery-photo-url',
    })

    expect(result.isRight()).toBe(true)
    expect(ordersRepository.items[0]).toEqual(expect.objectContaining({
      status: OrderStatus.create('DELIVERED'),
      deliveryPhotoUrl: expect.any(String),
      deliveredAt: expect.any(Date),
    }))
  })

  it('should not be able to mark a order as delivered if not picked up by the same delivery man', async () => {
    const [deliveryMan1, deliveryMan2] = [
      makeDeliveryMan(),
      makeDeliveryMan(),
    ]
    deliveryMenRepository.create(deliveryMan1)
    deliveryMenRepository.create(deliveryMan2)

    const recipient = makeRecipient()
    recipientsRepository.create(recipient)

    const order = makeOrder({
      recipientId: recipient.id,
      deliveryManId: deliveryMan1.id,
    })
    ordersRepository.create(order)

    const result = await sut.execute({
      authorId: deliveryMan2.id.toString(),
      orderId: order.id.toString(),
      deliveryPhotoUrl: 'fake-delivery-photo-url',
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(NotAllowedError)
  })

  it('should not be able to mark a non-existing order as delivered', async () => {
    const deliveryMan = makeDeliveryMan()
    deliveryMenRepository.create(deliveryMan)

    const result = await sut.execute({
      authorId: deliveryMan.id.toString(),
      orderId: 'non-existing-id',
      deliveryPhotoUrl: 'fake-delivery-photo-url',
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(ResourceNotFoundError)
  })
})