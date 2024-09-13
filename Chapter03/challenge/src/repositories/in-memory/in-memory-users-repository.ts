import { Prisma, Role, User } from "@prisma/client";
import { randomUUID } from "crypto";
import { UsersRepository } from "../users-repository";

export class InMemoryUsersRepository implements UsersRepository {
  public items: User[] = []
  
  async create(data: Prisma.UserCreateInput) {
    const user = {
      id: randomUUID(),
      role: Role.USER,
      ...data,
    }

    this.items.push(user)

    return user
  }

  async findByEmail(email: string) {
    const user = this.items.find(item =>
      item.email === email
    )

    return user ?? null
  }
}