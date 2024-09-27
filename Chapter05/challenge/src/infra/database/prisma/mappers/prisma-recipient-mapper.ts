import { UniqueEntityID } from "@/core/entities/unique-entity-id";
import { Recipient } from "@/domain/delivery/enterprise/entities/recipient";
import { CPF } from "@/domain/delivery/enterprise/entities/value-objects/cpf";
import { Location } from "@/domain/delivery/enterprise/entities/value-objects/location";
import { Prisma, User as PrismaRecipient } from "@prisma/client";

export class PrismaRecipientMapper {
  static toDomain(raw: PrismaRecipient): Recipient {
    if (!raw.latitude || !raw.longitude) {
      throw new Error()
    }
    
    return Recipient.create({
      cpf: CPF.create(raw.cpf),
      name: raw.name,
      password: raw.password,
      location: Location.create({
        latitude: raw.latitude.toNumber(),
        longitude: raw.longitude.toNumber(),
      })
    }, new UniqueEntityID(raw.id))
  }

  static toPrisma(recipient: Recipient): Prisma.UserUncheckedCreateInput {
    return {
      id: recipient.id.toString(),
      cpf: recipient.cpf.value,
      name: recipient.name,
      password: recipient.password,
      latitude: recipient.location.latitude,
      longitude: recipient.location.longitude,
      role: 'RECIPIENT',
    }
  }
}