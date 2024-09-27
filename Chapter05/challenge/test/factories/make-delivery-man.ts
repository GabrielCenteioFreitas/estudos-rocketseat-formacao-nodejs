import { UniqueEntityID } from "@/core/entities/unique-entity-id";
import { DeliveryMan, DeliveryManProps } from "@/domain/delivery/enterprise/entities/delivery-man";
import { CPF } from "@/domain/delivery/enterprise/entities/value-objects/cpf";
import { Location } from "@/domain/delivery/enterprise/entities/value-objects/location";
import { PrismaDeliveryManMapper } from "@/infra/database/prisma/mappers/prisma-delivery-man-mapper";
import { PrismaService } from "@/infra/database/prisma/prisma.service";
import { faker } from "@faker-js/faker";
import { Injectable } from "@nestjs/common";

export function makeDeliveryMan(
  override: Partial<DeliveryManProps> = {},
  id?: UniqueEntityID,
) {
  const deliveryMan = DeliveryMan.create(
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

  return deliveryMan
}

@Injectable()
export class DeliveryManFactory {
  constructor(
    private prisma: PrismaService,
  ) {}

  async makePrismaDeliveryMan(data: Partial<DeliveryManProps> = {}): Promise<DeliveryMan> {
    const deliveryMan = makeDeliveryMan(data)

    await this.prisma.user.create({
      data: PrismaDeliveryManMapper.toPrisma(deliveryMan),
    })

    return deliveryMan
  }
}