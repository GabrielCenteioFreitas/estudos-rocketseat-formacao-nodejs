import { NotAllowedError } from "@/core/errors/use-cases/not-allowed-error";
import { ResourceNotFoundError } from "@/core/errors/use-cases/resource-not-found-error";
import { makeAdmin } from "test/factories/make-admin";
import { makeRecipient } from "test/factories/make-recipient";
import { InMemoryAdminsRepository } from "test/repositories/in-memory-admins-repository";
import { InMemoryRecipientsRepository } from "test/repositories/in-memory-recipients-repository";
import { EditRecipientUseCase } from "./edit-recipient";

let recipientsRepository: InMemoryRecipientsRepository;
let adminsRepository: InMemoryAdminsRepository;
let sut: EditRecipientUseCase;

describe('Edit recipient - Use Case', () => {
  beforeEach(() => {
    recipientsRepository = new InMemoryRecipientsRepository()
    adminsRepository = new InMemoryAdminsRepository()
    sut = new EditRecipientUseCase(
      recipientsRepository,
      adminsRepository,
    )
  })

  it('should be able to edit a recipient', async () => {
    const admin = makeAdmin()
    adminsRepository.create(admin)

    const recipient = makeRecipient()
    recipientsRepository.create(recipient)

    const result = await sut.execute({
      authorId: admin.id.toString(),
      recipientId: recipient.id.toString(),
      name: 'Updated Name'
    })

    expect(result.isRight()).toBe(true)
    expect(recipientsRepository.items[0]).toEqual(expect.objectContaining({
      name: 'Updated Name'
    }))
  })

  it('should not be able to edit a recipient being a non-admin user', async () => {
    const [recipient1, recipient2] = await Promise.all([
      makeRecipient(),
      makeRecipient(),
    ])
    recipientsRepository.create(recipient1)
    recipientsRepository.create(recipient2)

    const result = await sut.execute({
      authorId: recipient1.id.toString(),
      recipientId: recipient2.id.toString(),
      name: 'Updated Name'
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(NotAllowedError)
  })

  it('should not be able to edit a non existing recipient', async () => {
    const admin = makeAdmin()
    adminsRepository.create(admin)

    const recipient = makeRecipient()

    const result = await sut.execute({
      authorId: admin.id.toString(),
      recipientId: 'non-existing-id',
      name: recipient.name,
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(ResourceNotFoundError)
  })
})