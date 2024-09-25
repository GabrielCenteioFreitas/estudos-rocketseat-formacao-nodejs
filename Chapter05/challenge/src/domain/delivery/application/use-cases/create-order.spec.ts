import { NotAllowedError } from "@/core/errors/use-cases/not-allowed-error";
import { ResourceNotFoundError } from "@/core/errors/use-cases/resource-not-found-error";
import { makeAdmin } from "test/factories/make-admin";
import { makeRecipient } from "test/factories/make-recipient";
import { InMemoryAdminsRepository } from "test/repositories/in-memory-admins-repository";
import { InMemoryOrdersRepository } from "test/repositories/in-memory-orders-repository";
import { InMemoryRecipientsRepository } from "test/repositories/in-memory-recipients-repository";
import { CreateOrderUseCase } from "./create-order";

let ordersRepository: InMemoryOrdersRepository;
let adminsRepository: InMemoryAdminsRepository;
let recipientsRepository: InMemoryRecipientsRepository;
let sut: CreateOrderUseCase;


describe('Create order - Use Case', () => {
  beforeEach(() => {
    recipientsRepository = new InMemoryRecipientsRepository()
    ordersRepository = new InMemoryOrdersRepository(recipientsRepository)
    adminsRepository = new InMemoryAdminsRepository()
    sut = new CreateOrderUseCase(
      ordersRepository,
      adminsRepository,
      recipientsRepository,
    )
  })

  it('should be able to create a new order', async () => {
    const admin = makeAdmin()
    adminsRepository.create(admin)
    const recipient = makeRecipient()
    recipientsRepository.create(recipient)

    const result = await sut.execute({
      authorId: admin.id.toString(),
      recipientId: recipient.id.toString(),
      title: 'Order',
    })

    expect(result.isRight()).toBe(true)
    expect(result.value).toEqual({
      order: ordersRepository.items[0]
    })
  })

  it('should not be able to register a order being a non admin user', async () => {
    const recipient = makeRecipient()
    recipientsRepository.create(recipient)

    const result = await sut.execute({
      authorId: 'non-existing-id',
      recipientId: recipient.id.toString(),
      title: 'Order',
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(NotAllowedError)
  })

  it('should not be able to register a order associated to a non existing recipient', async () => {
    const admin = makeAdmin()
    adminsRepository.create(admin)

    const result = await sut.execute({
      authorId: admin.id.toString(),
      recipientId: 'non-existing-id',
      title: 'Order',
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(ResourceNotFoundError)
  })
})