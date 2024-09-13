import { OrgsRepository } from "@/repositories/orgs-repository";
import { PetsRepository } from "@/repositories/pets-repository";
import { Pet, PetAge, PetEnergyLevel, PetEnvironment, PetIndependence, PetSize } from "@prisma/client";
import { ResourceNotFoundError } from "./errors/resource-not-found-error";

interface RegisterPetServiceParams {
  orgId: string;
  pet: {
    name: string;
    about: string;
    age: PetAge;
    size: PetSize;
    energyLevel: PetEnergyLevel;
    independence: PetIndependence;
    environment: PetEnvironment;
    photos?: string[];
    requirements?: string[];
  }
}

interface RegisterPetServiceReturn {
  pet: Pet;
}

export class RegisterPetService {
  constructor(
    private petsRepository: PetsRepository,
    private orgsRepository: OrgsRepository,
  ) {}

  async execute({
    orgId,
    pet,
  }: RegisterPetServiceParams): Promise<RegisterPetServiceReturn> {
    const org = await this.orgsRepository.findById(orgId)

    if (!org) {
      throw new ResourceNotFoundError()
    }

    const data = {
      org_id: orgId,
      name: pet.name,
      about: pet.about,
      age: pet.age,
      size: pet.size,
      energy_level: pet.energyLevel,
      independence: pet.independence,
      environment: pet.environment,
    }

    const createdPet = await this.petsRepository.create(data)

    return {
      pet: createdPet,
    }
  }
}

