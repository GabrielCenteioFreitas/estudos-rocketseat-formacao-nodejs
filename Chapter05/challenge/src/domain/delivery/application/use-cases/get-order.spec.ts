import { ResourceNotFoundError } from "@/core/errors/use-cases/resource-not-found-error";
import { makeAdmin } from "test/factories/make-admin";
import { makeOrder } from "test/factories/make-order";
import { makeRecipient } from "test/factories/make-recipient";
import { InMemoryAdminsRepository } from "test/repositories/in-memory-admins-repository";
import { InMemoryOrdersRepository } from "test/repositories/in-memory-orders-repository";
import { InMemoryRecipientsRepository } from "test/repositories/in-memory-recipients-repository";
import { GetOrderUseCase } from "./get-order";

let ordersRepository: InMemoryOrdersRepository;
let recipientsRepository: InMemoryRecipientsRepository;
let adminsRepository: InMemoryAdminsRepository;
let sut: GetOrderUseCase;

describe('Get order by ID - Use Case', () => {
  beforeEach(() => {
    recipientsRepository = new InMemoryRecipientsRepository()
    ordersRepository = new InMemoryOrdersRepository(recipientsRepository)
    adminsRepository = new InMemoryAdminsRepository()
    sut = new GetOrderUseCase(ordersRepository)
  })

  it('should be able to get a order by id', async () => {
    const admin = makeAdmin()
    adminsRepository.create(admin)

    const recipient = makeRecipient({
      name: 'Recipient'
    })
    recipientsRepository.create(recipient)

    const order = makeOrder({
      recipientId: recipient.id,
      title: 'Order Title'
    })
    ordersRepository.create(order)

    const result = await sut.execute({
      orderId: order.id.toString(),
    })

    expect(result.isRight()).toBe(true)
    expect(result.value).toMatchObject({
      order: {
        title: 'Order Title',
        recipient: 'Recipient',
        location: {
          longitude: recipient.location.longitude,
          latitude: recipient.location.latitude,
        }
      }
    })
  })

  it('should not be able to get a inexistent order', async () => {
    const result = await sut.execute({
      orderId: 'non-existing-id',
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(ResourceNotFoundError)
  })
})