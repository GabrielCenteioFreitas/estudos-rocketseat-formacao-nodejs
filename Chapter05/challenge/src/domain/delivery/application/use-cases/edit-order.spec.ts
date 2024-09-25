import { NotAllowedError } from "@/core/errors/use-cases/not-allowed-error";
import { ResourceNotFoundError } from "@/core/errors/use-cases/resource-not-found-error";
import { makeAdmin } from "test/factories/make-admin";
import { makeRecipient } from "test/factories/make-recipient";
import { InMemoryAdminsRepository } from "test/repositories/in-memory-admins-repository";
import { InMemoryRecipientsRepository } from "test/repositories/in-memory-recipients-repository";
import { InMemoryOrdersRepository } from "test/repositories/in-memory-orders-repository";
import { EditOrderUseCase } from "./edit-order";
import { makeOrder } from "test/factories/make-order";

let ordersRepository: InMemoryOrdersRepository;
let recipientsRepository: InMemoryRecipientsRepository;
let adminsRepository: InMemoryAdminsRepository;
let sut: EditOrderUseCase;

describe('Edit order - Use Case', () => {
  beforeEach(() => {
    recipientsRepository = new InMemoryRecipientsRepository()
    ordersRepository = new InMemoryOrdersRepository(recipientsRepository)
    adminsRepository = new InMemoryAdminsRepository()
    sut = new EditOrderUseCase(
      ordersRepository,
      adminsRepository,
      recipientsRepository,
    )
  })

  it('should be able to edit a order', async () => {
    const admin = makeAdmin()
    adminsRepository.create(admin)

    const [recipient01, recipient02] = [
      makeRecipient(),
      makeRecipient(),
    ]
    recipientsRepository.create(recipient01)
    recipientsRepository.create(recipient02)

    const order = makeOrder({
      recipientId: recipient01.id,
    })
    ordersRepository.create(order)

    const result = await sut.execute({
      authorId: admin.id.toString(),
      recipientId: recipient02.id.toString(),
      orderId: order.id.toString(),
      title: 'Updated Title',
    })

    expect(result.isRight()).toBe(true)
    expect(ordersRepository.items[0]).toEqual(expect.objectContaining({
      title: 'Updated Title',
      recipientId: recipient02.id,
    }))
  })

  it('should not be able to edit a order being a non-admin user', async () => {
    const recipient = makeRecipient()
    recipientsRepository.create(recipient)

    const order = makeOrder({
      recipientId: recipient.id,
    })
    ordersRepository.create(order)

    const result = await sut.execute({
      authorId: recipient.id.toString(),
      recipientId: recipient.id.toString(),
      orderId: order.id.toString(),
      title: 'Updated Title',
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(NotAllowedError)
  })

  it('should not be able to edit a order recipientId to a non existing recipient', async () => {
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
      recipientId: 'non-existing-id',
      orderId: order.id.toString(),
      title: order.title,
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(ResourceNotFoundError)
  })

  it('should not be able to edit a non existing order', async () => {
    const admin = makeAdmin()
    adminsRepository.create(admin)

    const [recipient01, recipient02] = [
      makeRecipient(),
      makeRecipient(),
    ]
    recipientsRepository.create(recipient01)
    recipientsRepository.create(recipient02)

    const result = await sut.execute({
      authorId: admin.id.toString(),
      recipientId: recipient02.id.toString(),
      orderId: 'non-existing-id',
      title: 'Title',
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(ResourceNotFoundError)
  })
})