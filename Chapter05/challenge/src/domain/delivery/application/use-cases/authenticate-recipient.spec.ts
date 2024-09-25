import { InvalidCredentialsError } from "@/core/errors/use-cases/invalid-credentials-error";
import { FakeEncrypter } from "test/cryptography/fake-encrypter";
import { FakeHasher } from "test/cryptography/fake-hasher";
import { makeRecipient } from "test/factories/make-recipient";
import { InMemoryRecipientsRepository } from "test/repositories/in-memory-recipients-repository";
import { CPF } from "../../enterprise/entities/value-objects/cpf";
import { AuthenticateRecipientUseCase } from "./authenticate-recipient";

let recipientsRepository: InMemoryRecipientsRepository;
let fakeHasher: FakeHasher;
let fakeEncrypter: FakeEncrypter;
let sut: AuthenticateRecipientUseCase;

describe('Authenticate recipient - Use Case', () => {
  beforeEach(() => {
    fakeHasher = new FakeHasher()
    fakeEncrypter = new FakeEncrypter()
    recipientsRepository = new InMemoryRecipientsRepository()
    sut = new AuthenticateRecipientUseCase(
      recipientsRepository,
      fakeHasher,
      fakeEncrypter,
    )
  })

  it('should be able to authenticate an recipient', async () => {
    const recipient = makeRecipient({
      cpf: CPF.create('123456789'),
      password: await fakeHasher.hash('123456'),
    })
    recipientsRepository.create(recipient)

    const result = await sut.execute({
      cpf: '123456789',
      password: '123456',
    })

    expect(result.isRight()).toBe(true)
    expect(result.value).toEqual({
      token: expect.any(String)
    })
  })

  it('should not be able to authenticate with wrong cpf', async () => {
    const recipient = makeRecipient({
      cpf: CPF.create('123456789'),
      password: await fakeHasher.hash('123456'),
    })
    recipientsRepository.create(recipient)

    const result = await sut.execute({
      cpf: 'invalid-cpf',
      password: '123456',
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(InvalidCredentialsError)
  })

  it('should not be able to authenticate with wrong password', async () => {
    const recipient = makeRecipient({
      cpf: CPF.create('123456789'),
      password: await fakeHasher.hash('123456'),
    })
    recipientsRepository.create(recipient)

    const result = await sut.execute({
      cpf: '123456789',
      password: 'invalid-password',
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(InvalidCredentialsError)
  })
})