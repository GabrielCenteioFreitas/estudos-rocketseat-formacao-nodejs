import { PetsRepository } from "@/repositories/pets-repository";
import { Pet, PetAge, PetEnergyLevel, PetEnvironment, PetIndependence, PetSize } from "@prisma/client";

interface ListPetsServiceParams {
  city: string;
  age?: PetAge;
  size?: PetSize;
  energyLevel?: PetEnergyLevel;
  independence?: PetIndependence;
  environment?: PetEnvironment;
}

interface ListPetsServiceReturn {
  pets: Pet[];
}

export class ListPetsService {
  constructor(private petsRepository: PetsRepository) {}

  async execute(characteristics: ListPetsServiceParams): Promise<ListPetsServiceReturn> {
    const pets = await this.petsRepository.findByCharacteristic(characteristics)

    return {
      pets,
    }
  }
}

