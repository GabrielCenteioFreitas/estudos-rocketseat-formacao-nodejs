import { PrismaOrgsRepository } from "@/repositories/prisma/prisma-orgs-repository";
import { LoginAsAnOrgService } from "../login-as-an-org";

export function makeLoginAsAnOrgService() {
  const orgsRepository = new PrismaOrgsRepository()
  const service = new LoginAsAnOrgService(orgsRepository)

  return service
}