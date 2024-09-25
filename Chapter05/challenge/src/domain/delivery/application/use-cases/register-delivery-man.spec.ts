import { FakeHasher } from "test/cryptography/fake-hasher";
import { CpfAlreadyInUseError } from "@/core/errors/use-cases/cpf-already-in-use-error";
import { RegisterDeliveryManUseCase } from "./register-delivery-man";
import { InMemoryDeliveryMenRepository } from "test/repositories/in-memory-delivery-men-repository";

let deliveryMenRepository: InMemoryDeliveryMenRepository;
let fakeHasher: FakeHasher;
let sut: RegisterDeliveryManUseCase;

describe('Register delivery man - Use Case', () => {
  beforeEach(() => {
    fakeHasher = new FakeHasher()
    deliveryMenRepository = new InMemoryDeliveryMenRepository()
    sut = new RegisterDeliveryManUseCase(deliveryMenRepository, fakeHasher)
  })

  it('should be able to register a new delivery man', async () => {
    const result = await sut.execute({
      name: 'Delivery Man',
      cpf: '123456789',
      password: '123456',
      location: {
        latitude: 0,
        longitude: 0,
      },
    })

    expect(result.isRight()).toBe(true)
    expect(result.value).toEqual({
      deliveryMan: deliveryMenRepository.items[0]
    })
  })

  it('should not be able to register a delivery man with same cpf twice', async () => {
    await sut.execute({
      name: 'DeliveryMan 01',
      cpf: '123456789',
      password: '123456',
      location: {
        latitude: 0,
        longitude: 0,
      },
    })

    const result = await sut.execute({
      name: 'DeliveryMan 02',
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