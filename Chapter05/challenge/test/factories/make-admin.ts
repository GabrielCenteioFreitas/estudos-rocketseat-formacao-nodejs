import { UniqueEntityID } from "@/core/entities/unique-entity-id";
import { Admin, AdminProps } from "@/domain/delivery/enterprise/entities/admin";
import { CPF } from "@/domain/delivery/enterprise/entities/value-objects/cpf";
import { PrismaAdminMapper } from "@/infra/database/prisma/mappers/prisma-admin-mapper";
import { PrismaService } from "@/infra/database/prisma/prisma.service";
import { faker } from "@faker-js/faker";
import { Injectable } from "@nestjs/common";

export function makeAdmin(
  override: Partial<AdminProps> = {},
  id?: UniqueEntityID,
) {
  const admin = Admin.create(
    {
      name: faker.person.fullName(),
      cpf: CPF.create(faker.number.bigInt().toString()),
      password: faker.internet.password(),
      ...override,
    },
    id
  )

  return admin
}

@Injectable()
export class AdminFactory {
  constructor(
    private prisma: PrismaService,
  ) {}

  async makePrismaAdmin(data: Partial<AdminProps> = {}): Promise<Admin> {
    const admin = makeAdmin(data)

    await this.prisma.user.create({
      data: PrismaAdminMapper.toPrisma(admin),
    })

    return admin
  }
}