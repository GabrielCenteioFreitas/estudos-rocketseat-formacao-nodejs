import { FakeHasher } from "test/cryptography/fake-hasher";
import { InMemoryAdminsRepository } from "test/repositories/in-memory-admins-repository";
import { RegisterAdminUseCase } from "./register-admin";
import { CpfAlreadyInUseError } from "@/core/errors/use-cases/cpf-already-in-use-error";

let adminsRepository: InMemoryAdminsRepository;
let fakeHasher: FakeHasher;
let sut: RegisterAdminUseCase;


describe('Register admin - Use Case', () => {
  beforeEach(() => {
    fakeHasher = new FakeHasher()
    adminsRepository = new InMemoryAdminsRepository()
    sut = new RegisterAdminUseCase(adminsRepository, fakeHasher)
  })

  it('should be able to register a new admin', async () => {
    const result = await sut.execute({
      name: 'Admin',
      cpf: '123456789',
      password: '123456',
    })

    expect(result.isRight()).toBe(true)
    expect(result.value).toEqual({
      admin: adminsRepository.items[0]
    })
  })

  it('should not be able to register a admin with same cpf twice', async () => {
    await sut.execute({
      name: 'Admin 01',
      cpf: '123456789',
      password: '123456',
    })

    const result = await sut.execute({
      name: 'Admin 02',
      cpf: '123456789',
      password: '123456',
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(CpfAlreadyInUseError)
  })
})