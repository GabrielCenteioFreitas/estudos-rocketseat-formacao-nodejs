import { PrismaOrgsRepository } from "@/repositories/prisma/prisma-orgs-repository";
import { PrismaPetsRepository } from "@/repositories/prisma/prisma-pets-repository";
import { ListPetsService } from "../list-pets";

export function makeListPetsService() {
  const orgsRepository = new PrismaOrgsRepository()
  const petsRepository = new PrismaPetsRepository(orgsRepository)
  const service = new ListPetsService(petsRepository)

  return service
}