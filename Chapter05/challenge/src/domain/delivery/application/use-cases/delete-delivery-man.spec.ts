import { NotAllowedError } from "@/core/errors/use-cases/not-allowed-error";
import { ResourceNotFoundError } from "@/core/errors/use-cases/resource-not-found-error";
import { makeAdmin } from "test/factories/make-admin";
import { makeDeliveryMan } from "test/factories/make-delivery-man";
import { InMemoryAdminsRepository } from "test/repositories/in-memory-admins-repository";
import { InMemoryDeliveryMenRepository } from "test/repositories/in-memory-delivery-men-repository";
import { DeleteDeliveryManUseCase } from "./delete-delivery-man";

let deliveryMenRepository: InMemoryDeliveryMenRepository;
let adminsRepository: InMemoryAdminsRepository;
let sut: DeleteDeliveryManUseCase;

describe('Delete delivery man - Use Case', () => {
  beforeEach(() => {
    deliveryMenRepository = new InMemoryDeliveryMenRepository()
    adminsRepository = new InMemoryAdminsRepository()
    sut = new DeleteDeliveryManUseCase(
      deliveryMenRepository,
      adminsRepository,
    )
  })

  it('should be able to delete a delivery man', async () => {
    const admin = makeAdmin()
    adminsRepository.create(admin)

    const deliveryMan = makeDeliveryMan()
    deliveryMenRepository.create(deliveryMan)

    const result = await sut.execute({
      authorId: admin.id.toString(),
      deliveryManId: deliveryMan.id.toString(),
    })

    expect(result.isRight()).toBe(true)
    expect(deliveryMenRepository.items).toHaveLength(0)
  })

  it('should not be able to delete a delivery man being a non-admin user', async () => {
    const [deliveryMan1, deliveryMan2] = await Promise.all([
      makeDeliveryMan(),
      makeDeliveryMan(),
    ])
    deliveryMenRepository.create(deliveryMan1)
    deliveryMenRepository.create(deliveryMan2)

    const result = await sut.execute({
      authorId: deliveryMan1.id.toString(),
      deliveryManId: deliveryMan2.id.toString(),
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(NotAllowedError)
  })

  it('should not be able to delete a non existing delivery man', async () => {
    const admin = makeAdmin()
    adminsRepository.create(admin)

    const result = await sut.execute({
      authorId: admin.id.toString(),
      deliveryManId: 'non-existing-id',
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(ResourceNotFoundError)
  })
})