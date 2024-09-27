import { FindManyNearbyParams, OrdersRepository } from "@/domain/delivery/application/repositories/orders-repository";
import { Order } from "@/domain/delivery/enterprise/entities/order";
import { PrismaService } from "../prisma.service";
import { PrismaOrderMapper } from "../mappers/prisma-order-mapper";
import { Injectable } from "@nestjs/common";
import { OrderDetails } from "@/domain/delivery/enterprise/entities/value-objects/order-details";
import { Order as PrismaOrder } from "@prisma/client";
import { PrismaOrderDetailsMapper } from "../mappers/prisma-order-details-mapper";
import { DomainEvents } from "@/core/events/domain-events";
import { CacheRepository } from "@/infra/cache/cache-repository";
import { Decimal } from "@prisma/client/runtime/library";

@Injectable()
export class PrismaOrdersRepository implements OrdersRepository {
  constructor(
    private prisma: PrismaService,
    private cache: CacheRepository,
  ) {}

  async create(order: Order): Promise<void> {
    const data = PrismaOrderMapper.toPrisma(order)

    await this.prisma.order.create({
      data,
    })
  }

  async save(order: Order): Promise<void> {
    const data = PrismaOrderMapper.toPrisma(order)

    await Promise.all([
      this.prisma.order.update({
        where: {
          id: data.id,
        },
        data,
      }),
      this.cache.delete(`order:${order.id.toString()}:details`)
    ])

    DomainEvents.dispatchEventsForAggregate(order.id)
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
    const cacheHit = await this.cache.get(`order:${id}:details`)

    if (cacheHit) {
      const cachedData = JSON.parse(cacheHit)

      cachedData.recipient.latitude = new Decimal(cachedData.recipient.latitude)
      cachedData.recipient.longitude = new Decimal(cachedData.recipient.longitude)

      return PrismaOrderDetailsMapper.toDomain(cachedData)
    }

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

    await this.cache.set(
      `order:${id}:details`,
      JSON.stringify(order),
    )

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