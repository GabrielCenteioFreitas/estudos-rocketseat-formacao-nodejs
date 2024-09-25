import { UniqueEntityID } from "@/core/entities/unique-entity-id";
import { Admin, AdminProps } from "@/domain/delivery/enterprise/entities/admin";
import { CPF } from "@/domain/delivery/enterprise/entities/value-objects/cpf";
import { faker } from "@faker-js/faker";

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