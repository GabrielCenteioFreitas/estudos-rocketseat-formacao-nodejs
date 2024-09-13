import { InMemoryOrgsRepository } from "@/repositories/in-memory/in-memory-orgs-repository";
import { InMemoryPetsRepository } from "@/repositories/in-memory/in-memory-pets-repository";
import { OrgsRepository } from "@/repositories/orgs-repository";
import { PetsRepository } from "@/repositories/pets-repository";
import { PetAge, PetEnergyLevel, PetEnvironment, PetIndependence, PetSize } from "@prisma/client";
import { hash } from "bcryptjs";
import { beforeEach, describe, expect, it } from "vitest";
import { ResourceNotFoundError } from "./errors/resource-not-found-error";
import { RegisterPetService } from "./register-pet";

let petsRepository: PetsRepository;
let orgsRepository: OrgsRepository;
let sut: RegisterPetService;

describe('Register Pet Service', () => {
  beforeEach(() => {
    orgsRepository = new InMemoryOrgsRepository()
    petsRepository = new InMemoryPetsRepository(orgsRepository)
    sut = new RegisterPetService(petsRepository, orgsRepository)
  })

  it('should be able to register a pet', async () => {
    const org = await orgsRepository.create({
      name: 'Org',
      email: 'org@example.com',
      password_hash: await hash('123456', 6),
      author_name: 'Org Author',
      cep: '12345678',
      state: '',
      city: '',
      latitude: 0,
      longitude: 0,
      phone: '123456789',
    })

    const { pet } = await sut.execute({
      orgId: org.id,
      pet: {
        name: 'Pet',
        about: 'Pet Description',
        age: PetAge.ADULT,
        energyLevel: PetEnergyLevel.HIGH,
        environment: PetEnvironment.LARGE_SPACE,
        independence: PetIndependence.HIGH,
        size: PetSize.LARGE,
      }
    })
    
    expect(pet.id).toEqual(expect.any(String))
  })

  it('should not be able to register a pet with a non existing org id', async () => {
    await expect(sut.execute({
      orgId: 'non-existing-id',
      pet: {
        name: 'Pet',
        about: 'Pet Description',
        age: PetAge.ADULT,
        energyLevel: PetEnergyLevel.HIGH,
        environment: PetEnvironment.LARGE_SPACE,
        independence: PetIndependence.HIGH,
        size: PetSize.LARGE,
      }
    })).rejects.toBeInstanceOf(ResourceNotFoundError)
  })
})