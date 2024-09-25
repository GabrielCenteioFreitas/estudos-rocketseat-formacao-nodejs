import { NotAllowedError } from "@/core/errors/use-cases/not-allowed-error";
import { ResourceNotFoundError } from "@/core/errors/use-cases/resource-not-found-error";
import { makeAdmin } from "test/factories/make-admin";
import { makeOrder } from "test/factories/make-order";
import { makeRecipient } from "test/factories/make-recipient";
import { InMemoryOrdersRepository } from "test/repositories/in-memory-orders-repository";
import { InMemoryRecipientsRepository } from "test/repositories/in-memory-recipients-repository";
import { OrderStatus } from "../../enterprise/entities/value-objects/order-status";
import { MarkOrderAsInTransitUseCase } from "./mark-order-as-in-transit";
import { InMemoryDeliveryMenRepository } from "test/repositories/in-memory-delivery-men-repository";
import { makeDeliveryMan } from "test/factories/make-delivery-man";
import { InMemoryAdminsRepository } from "test/repositories/in-memory-admins-repository";

let ordersRepository: InMemoryOrdersRepository;
let recipientsRepository: InMemoryRecipientsRepository;
let deliveryMenRepository: InMemoryDeliveryMenRepository;
let adminsRepository: InMemoryAdminsRepository;
let sut: MarkOrderAsInTransitUseCase;

describe('Mark order as in-transit - Use Case', () => {
  beforeEach(() => {
    recipientsRepository = new InMemoryRecipientsRepository()
    ordersRepository = new InMemoryOrdersRepository(recipientsRepository)
    deliveryMenRepository = new InMemoryDeliveryMenRepository()
    adminsRepository = new InMemoryAdminsRepository()
    sut = new MarkOrderAsInTransitUseCase(
      ordersRepository,
      deliveryMenRepository,
    )
  })

  it('should be able to mark a order as in-transit', async () => {
    const deliveryMan = makeDeliveryMan()
    deliveryMenRepository.create(deliveryMan)

    const recipient = makeRecipient()
    recipientsRepository.create(recipient)

    const order = makeOrder({
      recipientId: recipient.id,
    })
    ordersRepository.create(order)

    const result = await sut.execute({
      authorId: deliveryMan.id.toString(),
      orderId: order.id.toString(),
    })

    expect(result.isRight()).toBe(true)
    expect(ordersRepository.items[0]).toEqual(expect.objectContaining({
      status: OrderStatus.create('IN_TRANSIT'),
      deliveryManId: deliveryMan.id,
    }))
  })

  it('should not be able to mark a order as in-transit being a recipient', async () => {
    const [recipient1, recipient2] = await Promise.all([
      makeRecipient(),
      makeRecipient(),
    ])
    recipientsRepository.create(recipient1)
    recipientsRepository.create(recipient2)

    const order = makeOrder({
      recipientId: recipient1.id,
    })
    ordersRepository.create(order)

    const result = await sut.execute({
      authorId: recipient2.id.toString(),
      orderId: order.id.toString(),
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(NotAllowedError)
  })

  it('should not be able to mark a order as in-transit being a admin', async () => {
    const admin = makeAdmin()
    adminsRepository.create(admin)

    const recipient = makeRecipient()
    recipientsRepository.create(recipient)

    const order = makeOrder({
      recipientId: recipient.id,
    })
    ordersRepository.create(order)

    const result = await sut.execute({
      authorId: admin.id.toString(),
      orderId: order.id.toString(),
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(NotAllowedError)
  })

  it('should not be able to mark a non-existing order as in-transit', async () => {
    const deliveryMan = makeDeliveryMan()
    deliveryMenRepository.create(deliveryMan)

    const result = await sut.execute({
      authorId: deliveryMan.id.toString(),
      orderId: 'non-existing-id',
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(ResourceNotFoundError)
  })
})