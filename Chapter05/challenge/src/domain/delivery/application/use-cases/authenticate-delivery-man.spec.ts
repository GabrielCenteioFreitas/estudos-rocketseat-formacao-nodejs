import { InvalidCredentialsError } from "@/core/errors/use-cases/invalid-credentials-error";
import { FakeEncrypter } from "test/cryptography/fake-encrypter";
import { FakeHasher } from "test/cryptography/fake-hasher";
import { makeDeliveryMan } from "test/factories/make-delivery-man";
import { InMemoryDeliveryMenRepository } from "test/repositories/in-memory-delivery-men-repository";
import { CPF } from "../../enterprise/entities/value-objects/cpf";
import { AuthenticateDeliveryManUseCase } from "./authenticate-delivery-man";

let deliveryMenRepository: InMemoryDeliveryMenRepository;
let fakeHasher: FakeHasher;
let fakeEncrypter: FakeEncrypter;
let sut: AuthenticateDeliveryManUseCase;

describe('Authenticate delivery man - Use Case', () => {
  beforeEach(() => {
    fakeHasher = new FakeHasher()
    fakeEncrypter = new FakeEncrypter()
    deliveryMenRepository = new InMemoryDeliveryMenRepository()
    sut = new AuthenticateDeliveryManUseCase(
      deliveryMenRepository,
      fakeHasher,
      fakeEncrypter,
    )
  })

  it('should be able to authenticate a delivery man', async () => {
    const deliveryMan = makeDeliveryMan({
      cpf: CPF.create('123456789'),
      password: await fakeHasher.hash('123456'),
    })
    deliveryMenRepository.create(deliveryMan)

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
    const deliveryMan = makeDeliveryMan({
      cpf: CPF.create('123456789'),
      password: await fakeHasher.hash('123456'),
    })
    deliveryMenRepository.create(deliveryMan)

    const result = await sut.execute({
      cpf: 'invalid-cpf',
      password: '123456',
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(InvalidCredentialsError)
  })

  it('should not be able to authenticate with wrong password', async () => {
    const deliveryMan = makeDeliveryMan({
      cpf: CPF.create('123456789'),
      password: await fakeHasher.hash('123456'),
    })
    deliveryMenRepository.create(deliveryMan)

    const result = await sut.execute({
      cpf: '123456789',
      password: 'invalid-password',
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(InvalidCredentialsError)
  })
})