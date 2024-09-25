import { InvalidCredentialsError } from "@/core/errors/use-cases/invalid-credentials-error";
import { NotAllowedError } from "@/core/errors/use-cases/not-allowed-error";
import { ResourceNotFoundError } from "@/core/errors/use-cases/resource-not-found-error";
import { FakeHasher } from "test/cryptography/fake-hasher";
import { makeAdmin } from "test/factories/make-admin";
import { InMemoryAdminsRepository } from "test/repositories/in-memory-admins-repository";
import { CPF } from "../../enterprise/entities/value-objects/cpf";
import { InMemoryDeliveryMenRepository } from "test/repositories/in-memory-delivery-men-repository";
import { makeDeliveryMan } from "test/factories/make-delivery-man";
import { ChangeDeliveryManPasswordUseCase } from "./change-delivery-man-password";

let adminsRepository: InMemoryAdminsRepository;
let deliveryMenRepository: InMemoryDeliveryMenRepository;
let fakeHasher: FakeHasher;
let sut: ChangeDeliveryManPasswordUseCase;

describe('Change admin password - Use Case', () => {
  beforeEach(() => {
    fakeHasher = new FakeHasher()
    adminsRepository = new InMemoryAdminsRepository()
    deliveryMenRepository = new InMemoryDeliveryMenRepository()
    sut = new ChangeDeliveryManPasswordUseCase(
      adminsRepository,
      deliveryMenRepository,
      fakeHasher,
    )
  })

  it('should be able to change a deliveryMan password', async () => {
    const admin = makeAdmin({
      password: await fakeHasher.hash('123456'),
    })
    adminsRepository.create(admin)

    const deliveryMan = makeDeliveryMan({
      password: await fakeHasher.hash('123456'),
    })
    deliveryMenRepository.create(deliveryMan)

    const result = await sut.execute({
      authorId: admin.id.toString(),
      deliveryManId: deliveryMan.id.toString(),
      password: '123456',
      newPassword: '1234567',
    })

    const newPasswordHashed = fakeHasher.hash('1234567')

    expect(result.isRight()).toBe(true)
    expect(deliveryMenRepository.items[0]).toMatchObject({
      password: newPasswordHashed
    })
    expect(result.value).toEqual({
      deliveryMan: deliveryMenRepository.items[0],
    })
  })

  it('should not be able to change a deliveryMan password not being an admin', async () => {
    const [deliveryMan01, deliveryMan02] = await Promise.all([
      makeDeliveryMan({
        password: await fakeHasher.hash('123456'),
      }),
      makeDeliveryMan({
        password: await fakeHasher.hash('123456'),
      }),
    ])
    deliveryMenRepository.create(deliveryMan01)
    deliveryMenRepository.create(deliveryMan02)

    const result = await sut.execute({
      authorId: deliveryMan01.id.toString(),
      deliveryManId: deliveryMan02.id.toString(),
      password: '123456',
      newPassword: '1234567',
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(NotAllowedError)
  })

  it('should not be able to change a deliveryMan password with wrong password', async () => {
    const admin = makeAdmin({
      cpf: CPF.create('123456789'),
      password: await fakeHasher.hash('123456'),
    })
    adminsRepository.create(admin)

    const deliveryMan = makeDeliveryMan({
      password: await fakeHasher.hash('123456'),
    })
    deliveryMenRepository.create(deliveryMan)

    const result = await sut.execute({
      authorId: admin.id.toString(),
      deliveryManId: deliveryMan.id.toString(),
      password: 'wrong-password',
      newPassword: '1234567',
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(InvalidCredentialsError)
  })

  it('should not be able to change a non existing deliveryMan password', async () => {
    const admin = makeAdmin({
      cpf: CPF.create('123456789'),
      password: await fakeHasher.hash('123456'),
    })
    adminsRepository.create(admin)

    const deliveryMan = makeDeliveryMan({
      password: await fakeHasher.hash('123456'),
    })
    deliveryMenRepository.create(deliveryMan)

    const result = await sut.execute({
      authorId: admin.id.toString(),
      deliveryManId: 'non-existing-id',
      password: '123456',
      newPassword: '1234567',
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(ResourceNotFoundError)
  })
})