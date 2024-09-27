import { UniqueEntityID } from "@/core/entities/unique-entity-id";
import { Admin } from "@/domain/delivery/enterprise/entities/admin";
import { CPF } from "@/domain/delivery/enterprise/entities/value-objects/cpf";
import { Prisma, User as PrismaAdmin } from "@prisma/client";

export class PrismaAdminMapper {
  static toDomain(raw: PrismaAdmin): Admin {
    return Admin.create({
      cpf: CPF.create(raw.cpf),
      name: raw.name,
      password: raw.password,
    }, new UniqueEntityID(raw.id))
  }

  static toPrisma(admin: Admin): Prisma.UserUncheckedCreateInput {
    return {
      id: admin.id.toString(),
      cpf: admin.cpf.value,
      name: admin.name,
      password: admin.password,
      role: 'ADMIN',
    }
  }
}