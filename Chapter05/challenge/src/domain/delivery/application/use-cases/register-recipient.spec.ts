import { CpfAlreadyInUseError } from "@/core/errors/use-cases/cpf-already-in-use-error";
import { FakeHasher } from "test/cryptography/fake-hasher";
import { InMemoryRecipientsRepository } from "test/repositories/in-memory-recipients-repository";
import { RegisterRecipientUseCase } from "./register-recipient";

let recipientsRepository: InMemoryRecipientsRepository;
let fakeHasher: FakeHasher;
let sut: RegisterRecipientUseCase;


describe('Register recipient - Use Case', () => {
  beforeEach(() => {
    fakeHasher = new FakeHasher()
    recipientsRepository = new InMemoryRecipientsRepository()
    sut = new RegisterRecipientUseCase(recipientsRepository, fakeHasher)
  })

  it('should be able to register a new recipient', async () => {
    const result = await sut.execute({
      name: 'Recipient',
      cpf: '123456789',
      password: '123456',
      location: {
        latitude: 0,
        longitude: 0,
      },
    })

    expect(result.isRight()).toBe(true)
    expect(result.value).toEqual({
      recipient: recipientsRepository.items[0]
    })
  })

  it('should not be able to register a recipient with same cpf twice', async () => {
    await sut.execute({
      name: 'Recipient 01',
      cpf: '123456789',
      password: '123456',
      location: {
        latitude: 0,
        longitude: 0,
      },
    })

    const result = await sut.execute({
      name: 'Recipient 02',
      cpf: '123456789',
      password: '123456',
      location: {
        latitude: 0,
        longitude: 0,
      },
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(CpfAlreadyInUseError)
  })
})