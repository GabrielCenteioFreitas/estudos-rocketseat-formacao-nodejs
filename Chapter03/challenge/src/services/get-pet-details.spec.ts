import { InMemoryPetsRepository } from "@/repositories/in-memory/in-memory-pets-repository";
import { PetsRepository } from "@/repositories/pets-repository";
import { PetAge, PetEnergyLevel, PetEnvironment, PetIndependence, PetSize } from "@prisma/client";
import { beforeEach, describe, expect, it } from "vitest";
import { GetPetDetailsService } from "./get-pet-details";
import { OrgsRepository } from "@/repositories/orgs-repository";
import { InMemoryOrgsRepository } from "@/repositories/in-memory/in-memory-orgs-repository";
import { hash } from "bcryptjs";
import { ResourceNotFoundError } from "./errors/resource-not-found-error";

let petsRepository: PetsRepository;
let orgsRepository: OrgsRepository;
let sut: GetPetDetailsService;

describe('Get Pet Details Service', () => {
  beforeEach(() => {
    orgsRepository = new InMemoryOrgsRepository()
    petsRepository = new InMemoryPetsRepository(orgsRepository)
    sut = new GetPetDetailsService(petsRepository)
  })

  it('should be able to get pet details', async () => {
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

    const createdPet = await petsRepository.create({
      org_id: org.id,
      name: 'Pet',
      about: 'Pet Description',
      age: PetAge.ADULT,
      energy_level: PetEnergyLevel.HIGH,
      environment: PetEnvironment.LARGE_SPACE,
      independence: PetIndependence.HIGH,
      size: PetSize.LARGE,
    })

    const { pet } = await sut.execute({
      petId: createdPet.id,
    })
    
    expect(pet.id).toEqual(createdPet.id)
    expect(pet.name).toEqual('Pet')
  })

  it('should not be able to get pet details with a non existing pet id', async () => {
    await expect(() => 
      sut.execute({
        petId: 'non-existing-id',
      })
    ).rejects.toBeInstanceOf(ResourceNotFoundError)
  })
})