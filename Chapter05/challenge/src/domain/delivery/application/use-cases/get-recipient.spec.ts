import { NotAllowedError } from "@/core/errors/use-cases/not-allowed-error";
import { ResourceNotFoundError } from "@/core/errors/use-cases/resource-not-found-error";
import { makeAdmin } from "test/factories/make-admin";
import { makeRecipient } from "test/factories/make-recipient";
import { InMemoryAdminsRepository } from "test/repositories/in-memory-admins-repository";
import { InMemoryRecipientsRepository } from "test/repositories/in-memory-recipients-repository";
import { GetRecipientUseCase } from "./get-recipient";

let recipientsRepository: InMemoryRecipientsRepository;
let adminsRepository: InMemoryAdminsRepository;
let sut: GetRecipientUseCase;

describe('Get recipient - Use Case', () => {
  beforeEach(() => {
    recipientsRepository = new InMemoryRecipientsRepository()
    adminsRepository = new InMemoryAdminsRepository()
    sut = new GetRecipientUseCase(
      recipientsRepository,
      adminsRepository,
    )
  })

  it('should be able to get a recipient', async () => {
    const admin = makeAdmin()
    adminsRepository.create(admin)

    const recipient = makeRecipient()
    recipientsRepository.create(recipient)

    const result = await sut.execute({
      authorId: admin.id.toString(),
      recipientId: recipient.id.toString(),
    })

    expect(result.isRight()).toBe(true)
    expect(result.value).toEqual({
      recipient: recipientsRepository.items[0]
    })
  })

  it('should not be able to get a recipient being a non-admin user', async () => {
    const [recipient1, recipient2] = await Promise.all([
      makeRecipient(),
      makeRecipient(),
    ])
    recipientsRepository.create(recipient1)
    recipientsRepository.create(recipient2)

    const result = await sut.execute({
      authorId: recipient1.id.toString(),
      recipientId: recipient2.id.toString(),
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(NotAllowedError)
  })

  it('should not be able to get a non existing recipient', async () => {
    const admin = makeAdmin()
    adminsRepository.create(admin)

    const result = await sut.execute({
      authorId: admin.id.toString(),
      recipientId: 'non-existing-id',
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(ResourceNotFoundError)
  })
})