import { PrismaPetsRepository } from "@/repositories/prisma/prisma-pets-repository";
import { GetPetDetailsService } from "../get-pet-details";
import { PrismaOrgsRepository } from "@/repositories/prisma/prisma-orgs-repository";

export function makeGetPetDetailsService() {
  const orgsRepository = new PrismaOrgsRepository()
  const petsRepository = new PrismaPetsRepository(orgsRepository)
  const service = new GetPetDetailsService(petsRepository)

  return service
}