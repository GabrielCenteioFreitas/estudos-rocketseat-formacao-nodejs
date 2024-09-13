import { PrismaUsersRepository } from "@/repositories/prisma/prisma-users-repository";
import { LoginAsAnUserService } from "../login-as-an-user";

export function makeLoginAsAnUserService() {
  const usersRepository = new PrismaUsersRepository()
  const service = new LoginAsAnUserService(usersRepository)

  return service
}