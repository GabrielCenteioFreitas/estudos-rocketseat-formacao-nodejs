import { UniqueEntityID } from "@/core/entities/unique-entity-id";
import { Recipient, RecipientProps } from "@/domain/delivery/enterprise/entities/recipient";
import { CPF } from "@/domain/delivery/enterprise/entities/value-objects/cpf";
import { Location } from "@/domain/delivery/enterprise/entities/value-objects/location";
import { PrismaRecipientMapper } from "@/infra/database/prisma/mappers/prisma-recipient-mapper";
import { PrismaService } from "@/infra/database/prisma/prisma.service";
import { faker } from "@faker-js/faker";
import { Injectable } from "@nestjs/common";

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

@Injectable()
export class RecipientFactory {
  constructor(
    private prisma: PrismaService,
  ) {}

  async makePrismaRecipient(data: Partial<RecipientProps> = {}): Promise<Recipient> {
    const recipient = makeRecipient(data)

    await this.prisma.user.create({
      data: PrismaRecipientMapper.toPrisma(recipient),
    })

    return recipient
  }
}