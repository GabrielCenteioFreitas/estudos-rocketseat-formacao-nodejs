import { DeliveryMenRepository } from "@/domain/delivery/application/repositories/delivery-men-repository";
import { DeliveryMan } from "@/domain/delivery/enterprise/entities/delivery-man";
import { PrismaService } from "../prisma.service";
import { PrismaDeliveryManMapper } from "../mappers/prisma-delivery-man-mapper";
import { Injectable } from "@nestjs/common";
import { UserRole } from "@prisma/client";

@Injectable()
export class PrismaDeliveryMenRepository implements DeliveryMenRepository {
  private role: UserRole = 'DELIVERY_MAN'

  constructor(
    private prisma: PrismaService,
  ) {}

  async create(deliveryMan: DeliveryMan): Promise<void> {
    const data = PrismaDeliveryManMapper.toPrisma(deliveryMan)

    await this.prisma.user.create({
      data,
    })
  }

  async save(deliveryMan: DeliveryMan): Promise<void> {
    const data = PrismaDeliveryManMapper.toPrisma(deliveryMan)

    await this.prisma.user.update({
      where: {
        id: data.id,
        role: this.role,
      },
      data,
    })
  }

  async delete(deliveryMan: DeliveryMan): Promise<void> {
    const data = PrismaDeliveryManMapper.toPrisma(deliveryMan)

    await this.prisma.user.delete({
      where: {
        id: data.id,
        role: this.role,
      },
    })
  }

  async findByCPF(cpf: string): Promise<DeliveryMan | null> {
    const deliveryMan = await this.prisma.user.findUnique({
      where: {
        cpf,
        role: this.role,
      }
    })

    if (!deliveryMan) {
      return null
    }

    return PrismaDeliveryManMapper.toDomain(deliveryMan)
  }

  async findById(id: string): Promise<DeliveryMan | null> {
    const deliveryMan = await this.prisma.user.findUnique({
      where: {
        id,
        role: this.role,
      }
    })

    if (!deliveryMan) {
      return null
    }

    return PrismaDeliveryManMapper.toDomain(deliveryMan)
  }
}