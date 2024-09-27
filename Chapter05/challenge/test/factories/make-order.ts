import { UniqueEntityID } from "@/core/entities/unique-entity-id";
import { Order, OrderProps } from "@/domain/delivery/enterprise/entities/order";
import { OrderStatus } from "@/domain/delivery/enterprise/entities/value-objects/order-status";
import { PrismaOrderMapper } from "@/infra/database/prisma/mappers/prisma-order-mapper";
import { PrismaService } from "@/infra/database/prisma/prisma.service";
import { faker } from "@faker-js/faker";
import { Injectable } from "@nestjs/common";

export function makeOrder(
  override: Partial<OrderProps> = {},
  id?: UniqueEntityID,
) {
  const order = Order.create(
    {
      recipientId: new UniqueEntityID(),
      title: faker.commerce.productName(),
      status: OrderStatus.create('PENDING'),
      createdAt: new Date(),
      ...override,
    },
    id
  )

  return order
}

@Injectable()
export class OrderFactory {
  constructor(
    private prisma: PrismaService,
  ) {}

  async makePrismaOrder(data: Partial<OrderProps> = {}): Promise<Order> {
    const order = makeOrder(data)

    await this.prisma.order.create({
      data: PrismaOrderMapper.toPrisma(order),
    })

    return order
  }
}