import { RecipientsRepository } from "@/domain/delivery/application/repositories/recipients-repository";
import { Recipient } from "@/domain/delivery/enterprise/entities/recipient";
import { PrismaService } from "../prisma.service";
import { PrismaRecipientMapper } from "../mappers/prisma-recipient-mapper";
import { Injectable } from "@nestjs/common";
import { UserRole } from "@prisma/client";

@Injectable()
export class PrismaRecipientsRepository implements RecipientsRepository {
  private role: UserRole = 'RECIPIENT'

  constructor(
    private prisma: PrismaService,
  ) {}

  async create(recipient: Recipient): Promise<void> {
    const data = PrismaRecipientMapper.toPrisma(recipient)

    await this.prisma.user.create({
      data,
    })
  }

  async save(recipient: Recipient): Promise<void> {
    const data = PrismaRecipientMapper.toPrisma(recipient)

    await this.prisma.user.update({
      where: {
        id: data.id,
        role: this.role,
      },
      data,
    })
  }

  async delete(recipient: Recipient): Promise<void> {
    const data = PrismaRecipientMapper.toPrisma(recipient)

    await this.prisma.user.delete({
      where: {
        id: data.id,
        role: this.role,
      },
    })
  }

  async findByCPF(cpf: string): Promise<Recipient | null> {
    const recipient = await this.prisma.user.findUnique({
      where: {
        cpf,
        role: this.role,
      }
    })

    if (!recipient) {
      return null
    }

    return PrismaRecipientMapper.toDomain(recipient)
  }

  async findById(id: string): Promise<Recipient | null> {
    const recipient = await this.prisma.user.findUnique({
      where: {
        id,
        role: this.role,
      }
    })

    if (!recipient) {
      return null
    }

    return PrismaRecipientMapper.toDomain(recipient)
  }
}