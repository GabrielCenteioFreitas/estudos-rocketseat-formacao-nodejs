import { PrismaOrgsRepository } from "@/repositories/prisma/prisma-orgs-repository";
import { PrismaPetsRepository } from "@/repositories/prisma/prisma-pets-repository";
import { RegisterPetService } from "../register-pet";

export function makeRegisterPetService() {
  const orgsRepository = new PrismaOrgsRepository()
  const petsRepository = new PrismaPetsRepository(orgsRepository)
  const service = new RegisterPetService(petsRepository, orgsRepository)

  return service
}