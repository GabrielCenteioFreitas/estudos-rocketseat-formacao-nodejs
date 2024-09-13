import { Pet, PetAge, PetEnergyLevel, PetEnvironment, PetIndependence, PetSize } from "@prisma/client";

export type CreatePetInput = {
  id?: string;
  name: string;
  about: string;
  age: PetAge;
  size: PetSize;
  energy_level: PetEnergyLevel;
  independence: PetIndependence;
  environment: PetEnvironment;
  photos?: string[];
  requirements?: string[];
  created_at?: Date | string;
  org_id: string;
}

export type FindByCharacteristicParams = {
  city: string;
  age?: PetAge;
  size?: PetSize;
  energyLevel?: PetEnergyLevel;
  independence?: PetIndependence;
  environment?: PetEnvironment;
}

export interface PetsRepository {
  create(data: CreatePetInput): Promise<Pet>;
  findById(petId: string): Promise<Pet | null>;
  findByCharacteristic(characteristics: FindByCharacteristicParams): Promise<Pet[]>;
}