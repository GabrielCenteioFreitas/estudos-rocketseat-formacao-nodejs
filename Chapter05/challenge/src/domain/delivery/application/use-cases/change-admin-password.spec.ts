import { InvalidCredentialsError } from "@/core/errors/use-cases/invalid-credentials-error";
import { NotAllowedError } from "@/core/errors/use-cases/not-allowed-error";
import { ResourceNotFoundError } from "@/core/errors/use-cases/resource-not-found-error";
import { FakeHasher } from "test/cryptography/fake-hasher";
import { makeAdmin } from "test/factories/make-admin";
import { InMemoryAdminsRepository } from "test/repositories/in-memory-admins-repository";
import { CPF } from "../../enterprise/entities/value-objects/cpf";
import { ChangeAdminPasswordUseCase } from "./change-admin-password";

let adminsRepository: InMemoryAdminsRepository;
let fakeHasher: FakeHasher;
let sut: ChangeAdminPasswordUseCase;

describe('Change admin password - Use Case', () => {
  beforeEach(() => {
    fakeHasher = new FakeHasher()
    adminsRepository = new InMemoryAdminsRepository()
    sut = new ChangeAdminPasswordUseCase(
      adminsRepository,
      fakeHasher,
    )
  })

  it('should be able to change an admin password', async () => {
    const admin = makeAdmin({
      password: await fakeHasher.hash('123456'),
    })
    adminsRepository.create(admin)

    const result = await sut.execute({
      authorId: admin.id.toString(),
      adminId: admin.id.toString(),
      password: '123456',
      newPassword: '1234567',
    })

    const newPasswordHashed = fakeHasher.hash('1234567')

    expect(result.isRight()).toBe(true)
    expect(adminsRepository.items[0]).toMatchObject({
      password: newPasswordHashed
    })
    expect(result.value).toEqual({
      admin: adminsRepository.items[0],
    })
  })

  it('should not be able to change an admin password from another user', async () => {
    const [admin01, admin02] = await Promise.all([
      makeAdmin({
        password: await fakeHasher.hash('123456'),
      }),
      makeAdmin({
        password: await fakeHasher.hash('123456'),
      }),
    ])
    adminsRepository.create(admin01)
    adminsRepository.create(admin02)

    const result = await sut.execute({
      authorId: admin01.id.toString(),
      adminId: admin02.id.toString(),
      password: 'wrong-password',
      newPassword: '1234567',
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(NotAllowedError)
  })

  it('should not be able to change an admin password with wrong password', async () => {
    const admin = makeAdmin({
      cpf: CPF.create('123456789'),
      password: await fakeHasher.hash('123456'),
    })
    adminsRepository.create(admin)

    const result = await sut.execute({
      authorId: admin.id.toString(),
      adminId: admin.id.toString(),
      password: 'wrong-password',
      newPassword: '1234567',
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(InvalidCredentialsError)
  })

  it('should not be able to change a non existing admin password', async () => {
    const result = await sut.execute({
      authorId: 'non-existing-id',
      adminId: 'non-existing-id',
      password: '123456',
      newPassword: '1234567',
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(ResourceNotFoundError)
  })
})