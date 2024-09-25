import { UniqueEntityID } from "@/core/entities/unique-entity-id";
import { Recipient, RecipientProps } from "@/domain/delivery/enterprise/entities/recipient";
import { CPF } from "@/domain/delivery/enterprise/entities/value-objects/cpf";
import { Location } from "@/domain/delivery/enterprise/entities/value-objects/location";
import { faker } from "@faker-js/faker";

export function makeRecipient(
  override: Partial<RecipientProps> = {},
  id?: UniqueEntityID,
) {
  const recipient = Recipient.create(
    {
      name: faker.person.fullName(),
      cpf: CPF.create(faker.number.bigInt().toString()),
      password: faker.internet.password(),
      location: Location.create({
        longitude: faker.location.longitude(),
        latitude: faker.location.latitude(),
      }),
      ...override,
    },
    id
  )

  return recipient
}