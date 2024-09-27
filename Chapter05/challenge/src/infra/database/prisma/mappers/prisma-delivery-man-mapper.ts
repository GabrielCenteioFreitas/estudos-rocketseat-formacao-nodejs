import { UniqueEntityID } from "@/core/entities/unique-entity-id";
import { DeliveryMan } from "@/domain/delivery/enterprise/entities/delivery-man";
import { CPF } from "@/domain/delivery/enterprise/entities/value-objects/cpf";
import { Location } from "@/domain/delivery/enterprise/entities/value-objects/location";
import { Prisma, User as PrismaDeliveryMan } from "@prisma/client";

export class PrismaDeliveryManMapper {
  static toDomain(raw: PrismaDeliveryMan): DeliveryMan {
    if (!raw.latitude || !raw.longitude) {
      throw new Error()
    }

    return DeliveryMan.create({
      cpf: CPF.create(raw.cpf),
      name: raw.name,
      password: raw.password,
      location: Location.create({
        latitude: raw.latitude.toNumber(),
        longitude: raw.longitude.toNumber(),
      })
    }, new UniqueEntityID(raw.id))
  }

  static toPrisma(deliveryMan: DeliveryMan): Prisma.UserUncheckedCreateInput {
    return {
      id: deliveryMan.id.toString(),
      cpf: deliveryMan.cpf.value,
      name: deliveryMan.name,
      password: deliveryMan.password,
      latitude: deliveryMan.location.latitude,
      longitude: deliveryMan.location.longitude,
      role: 'DELIVERY_MAN',
    }
  }
}