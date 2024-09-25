import { InvalidCredentialsError } from "@/core/errors/use-cases/invalid-credentials-error";
import { FakeEncrypter } from "test/cryptography/fake-encrypter";
import { FakeHasher } from "test/cryptography/fake-hasher";
import { makeAdmin } from "test/factories/make-admin";
import { InMemoryAdminsRepository } from "test/repositories/in-memory-admins-repository";
import { CPF } from "../../enterprise/entities/value-objects/cpf";
import { AuthenticateAdminUseCase } from "./authenticate-admin";

let adminsRepository: InMemoryAdminsRepository;
let fakeHasher: FakeHasher;
let fakeEncrypter: FakeEncrypter;
let sut: AuthenticateAdminUseCase;

describe('Authenticate admin - Use Case', () => {
  beforeEach(() => {
    fakeHasher = new FakeHasher()
    fakeEncrypter = new FakeEncrypter()
    adminsRepository = new InMemoryAdminsRepository()
    sut = new AuthenticateAdminUseCase(
      adminsRepository,
      fakeHasher,
      fakeEncrypter,
    )
  })

  it('should be able to authenticate an admin', async () => {
    const admin = makeAdmin({
      cpf: CPF.create('123456789'),
      password: await fakeHasher.hash('123456'),
    })
    adminsRepository.create(admin)

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
    const admin = makeAdmin({
      cpf: CPF.create('123456789'),
      password: await fakeHasher.hash('123456'),
    })
    adminsRepository.create(admin)

    const result = await sut.execute({
      cpf: 'invalid-cpf',
      password: '123456',
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(InvalidCredentialsError)
  })

  it('should not be able to authenticate with wrong password', async () => {
    const admin = makeAdmin({
      cpf: CPF.create('123456789'),
      password: await fakeHasher.hash('123456'),
    })
    adminsRepository.create(admin)

    const result = await sut.execute({
      cpf: '123456789',
      password: 'invalid-password',
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(InvalidCredentialsError)
  })
})