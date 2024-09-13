import { Prisma, Pet } from "@prisma/client";
import { FindByCharacteristicParams, PetsRepository } from "../pets-repository";
import { prisma } from "@/lib/prisma";
import { OrgsRepository } from "../orgs-repository";

export class PrismaPetsRepository implements PetsRepository {
  constructor(private orgsRepository: OrgsRepository) {}

  async create(data: Prisma.PetUncheckedCreateInput) {
    const pet = await prisma.pet.create({
      data,
    })

    return pet
  }

  async findById(petId: string) {
    const pet = await prisma.pet.findUnique({
      where: {
        id: petId
      }
    })

    return pet
  }

  async findByCity(city: string) {
    const pets = await prisma.pet.findMany({
      where: {
        org: {
          city,
        }
      }
    })

    return pets
  }

  async findByCharacteristic({
    city,
    age,
    energyLevel,
    environment,
    independence,
    size,
  }: FindByCharacteristicParams) {
    const pets = await prisma.pet.findMany({
      where: {
        org: {
          city,
        },
        age,
        energy_level: energyLevel,
        environment,
        independence,
        size,
      }
    })

    return pets
  }
}