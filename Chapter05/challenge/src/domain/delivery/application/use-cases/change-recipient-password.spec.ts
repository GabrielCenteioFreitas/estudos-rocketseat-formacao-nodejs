import { InvalidCredentialsError } from "@/core/errors/use-cases/invalid-credentials-error";
import { NotAllowedError } from "@/core/errors/use-cases/not-allowed-error";
import { ResourceNotFoundError } from "@/core/errors/use-cases/resource-not-found-error";
import { FakeHasher } from "test/cryptography/fake-hasher";
import { makeAdmin } from "test/factories/make-admin";
import { makeRecipient } from "test/factories/make-recipient";
import { InMemoryAdminsRepository } from "test/repositories/in-memory-admins-repository";
import { InMemoryRecipientsRepository } from "test/repositories/in-memory-recipients-repository";
import { CPF } from "../../enterprise/entities/value-objects/cpf";
import { ChangeRecipientPasswordUseCase } from "./change-recipient-password";

let adminsRepository: InMemoryAdminsRepository;
let recipientsRepository: InMemoryRecipientsRepository;
let fakeHasher: FakeHasher;
let sut: ChangeRecipientPasswordUseCase;

describe('Change admin password - Use Case', () => {
  beforeEach(() => {
    fakeHasher = new FakeHasher()
    adminsRepository = new InMemoryAdminsRepository()
    recipientsRepository = new InMemoryRecipientsRepository()
    sut = new ChangeRecipientPasswordUseCase(
      adminsRepository,
      recipientsRepository,
      fakeHasher,
    )
  })

  it('should be able to change a recipient password', async () => {
    const admin = makeAdmin({
      password: await fakeHasher.hash('123456'),
    })
    adminsRepository.create(admin)

    const recipient = makeRecipient({
      password: await fakeHasher.hash('123456'),
    })
    recipientsRepository.create(recipient)

    const result = await sut.execute({
      authorId: admin.id.toString(),
      recipientId: recipient.id.toString(),
      password: '123456',
      newPassword: '1234567',
    })

    const newPasswordHashed = fakeHasher.hash('1234567')

    expect(result.isRight()).toBe(true)
    expect(recipientsRepository.items[0]).toMatchObject({
      password: newPasswordHashed
    })
    expect(result.value).toEqual({
      recipient: recipientsRepository.items[0],
    })
  })

  it('should not be able to change a recipient password not being an admin', async () => {
    const [recipient01, recipient02] = await Promise.all([
      makeRecipient({
        password: await fakeHasher.hash('123456'),
      }),
      makeRecipient({
        password: await fakeHasher.hash('123456'),
      }),
    ])
    recipientsRepository.create(recipient01)
    recipientsRepository.create(recipient02)

    const result = await sut.execute({
      authorId: recipient01.id.toString(),
      recipientId: recipient02.id.toString(),
      password: '123456',
      newPassword: '1234567',
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(NotAllowedError)
  })

  it('should not be able to change a recipient password with wrong password', async () => {
    const admin = makeAdmin({
      cpf: CPF.create('123456789'),
      password: await fakeHasher.hash('123456'),
    })
    adminsRepository.create(admin)

    const recipient = makeRecipient({
      password: await fakeHasher.hash('123456'),
    })
    recipientsRepository.create(recipient)

    const result = await sut.execute({
      authorId: admin.id.toString(),
      recipientId: recipient.id.toString(),
      password: 'wrong-password',
      newPassword: '1234567',
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(InvalidCredentialsError)
  })

  it('should not be able to change a non existing recipient password', async () => {
    const admin = makeAdmin({
      cpf: CPF.create('123456789'),
      password: await fakeHasher.hash('123456'),
    })
    adminsRepository.create(admin)

    const recipient = makeRecipient({
      password: await fakeHasher.hash('123456'),
    })
    recipientsRepository.create(recipient)

    const result = await sut.execute({
      authorId: admin.id.toString(),
      recipientId: 'non-existing-id',
      password: '123456',
      newPassword: '1234567',
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(ResourceNotFoundError)
  })
})