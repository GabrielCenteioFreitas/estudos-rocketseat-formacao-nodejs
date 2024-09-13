import { PetsRepository } from "@/repositories/pets-repository";
import { Pet } from "@prisma/client";
import { ResourceNotFoundError } from "./errors/resource-not-found-error";

interface GetPetDetailsServiceParams {
  petId: string;
}

interface GetPetDetailsServiceReturn {
  pet: Pet;
}

export class GetPetDetailsService {
  constructor(private petsRepository: PetsRepository) {}

  async execute({
    petId
  }: GetPetDetailsServiceParams): Promise<GetPetDetailsServiceReturn> {
    const pet = await this.petsRepository.findById(petId)

    if (!pet) {
      throw new ResourceNotFoundError()
    }

    return {
      pet,
    }
  }
}

