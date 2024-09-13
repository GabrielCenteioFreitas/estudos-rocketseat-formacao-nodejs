import { Pet, PetAge, PetEnergyLevel, PetEnvironment, PetIndependence, PetSize } from "@prisma/client";
import { randomUUID } from "crypto";
import { CreatePetInput, FindByCharacteristicParams, PetsRepository } from "../pets-repository";
import { OrgsRepository } from "../orgs-repository";
import { InMemoryOrgsRepository } from "./in-memory-orgs-repository";

export class InMemoryPetsRepository implements PetsRepository {
  constructor(private orgsRepository: OrgsRepository) {}

  public items: Pet[] = []
  
  async create(data: CreatePetInput) {
    const pet = {
      ...data,
      id: randomUUID(),
      created_at: new Date(),
      photos: data.photos ?? [],
      requirements: data.requirements ?? [],
    }

    this.items.push(pet)

    return pet
  }

  async findById(petId: string) {
    const pet = this.items.find(
      item => item.id === petId
    )

    return pet ?? null
  }

  async findByCity(city: string) {
    const pets = [];

    for (const item of this.items) {
      const org = await this.orgsRepository.findById(item.org_id);

      if (org?.city === city) {
        pets.push(item);
      }
    }

    return pets;
  }

  async findByCharacteristic({
    city,
    age,
    energyLevel,
    environment,
    independence,
    size,
  }: FindByCharacteristicParams) {
    const pets = [];

    for (const item of this.items) {
      const org = await this.orgsRepository.findById(item.org_id);

      if (org?.city === city) {
        pets.push(item);
      }
    }

    const filteredPets = pets.filter(pet => {
      if (age && pet.age !== age) return false;
      if (energyLevel && pet.energy_level !== energyLevel) return false;
      if (environment && pet.environment !== environment) return false;
      if (independence && pet.independence !== independence) return false;
      if (size && pet.size !== size) return false;

      return true;
    })

    return filteredPets;
  }
}