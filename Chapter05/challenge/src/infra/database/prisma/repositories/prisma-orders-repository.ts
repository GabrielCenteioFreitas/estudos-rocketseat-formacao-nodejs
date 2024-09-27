import { FindManyNearbyParams, OrdersRepository } from "@/domain/delivery/application/repositories/orders-repository";
import { Order } from "@/domain/delivery/enterprise/entities/order";
import { PrismaService } from "../prisma.service";
import { PrismaOrderMapper } from "../mappers/prisma-order-mapper";
import { Injectable } from "@nestjs/common";
import { OrderDetails } from "@/domain/delivery/enterprise/entities/value-objects/order-details";
import { Order as PrismaOrder } from "@prisma/client";
import { PrismaOrderDetailsMapper } from "../mappers/prisma-order-details-mapper";

@Injectable()
export class PrismaOrdersRepository implements OrdersRepository {
  constructor(
    private prisma: PrismaService,
  ) {}

  async create(order: Order): Promise<void> {
    const data = PrismaOrderMapper.toPrisma(order)

    await this.prisma.order.create({
      data,
    })
  }

  async save(order: Order): Promise<void> {
    const data = PrismaOrderMapper.toPrisma(order)

    await this.prisma.order.update({
      where: {
        id: data.id,
      },
      data,
    })
  }

  async delete(order: Order): Promise<void> {
    const data = PrismaOrderMapper.toPrisma(order)

    await this.prisma.order.delete({
      where: {
        id: data.id,
      },
    })
  }

  async findById(id: string): Promise<Order | null> {
    const order = await this.prisma.order.findUnique({
      where: {
        id,
      }
    })

    if (!order) {
      return null
    }

    return PrismaOrderMapper.toDomain(order)
  }

  async findDetailsById(id: string): Promise<OrderDetails | null> {
    const order = await this.prisma.order.findUnique({
      where: {
        id,
      },
      include: {
        recipient: true,
      },
    })

    if (!order) {
      return null
    }

    return PrismaOrderDetailsMapper.toDomain(order)
  }

  async findManyByDeliveryManId(deliveryManId: string): Promise<Order[]> {
    const orders = await this.prisma.order.findMany({
      where: {
        deliveryManId,
        status: {
          in: ["DELIVERED", "RETURNED"],
        },
      },
    })

    return orders.map(PrismaOrderMapper.toDomain)
  }

  async findManyNearby({ latitude, longitude }: FindManyNearbyParams): Promise<Order[]> {
    const orders = await this.prisma.$queryRaw<PrismaOrder[]>`
      SELECT * from orders
      JOIN users ON orders.recipient_id = users.id
      WHERE
        ( 6371 * acos( cos( radians(${latitude}) ) * cos( radians( latitude ) ) * cos( radians( longitude ) - radians(${longitude}) ) + sin( radians(${latitude}) ) * sin( radians( latitude ) ) ) ) <= 5
        AND status = 'PENDING'
    `

    return orders.map(PrismaOrderMapper.toDomain)
  }
}