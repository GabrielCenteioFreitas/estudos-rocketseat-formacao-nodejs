import { UniqueEntityID } from "@/core/entities/unique-entity-id";
import { Order } from "@/domain/delivery/enterprise/entities/order";
import { OrderStatus } from "@/domain/delivery/enterprise/entities/value-objects/order-status";
import { Prisma, Order as PrismaOrder } from "@prisma/client";

export class PrismaOrderMapper {
  static toDomain(raw: PrismaOrder): Order {
    return Order.create({
      createdAt: raw.createdAt,
      recipientId: new UniqueEntityID(raw.recipientId),
      status: OrderStatus.create(raw.status),
      title: raw.title,
      deliveredAt: raw.deliveredAt,
      deliveryManId: raw.deliveryManId ? new UniqueEntityID(raw.deliveryManId) : null,
      deliveryPhotoUrl: raw.deliveryManId,
    }, new UniqueEntityID(raw.id))
  }

  static toPrisma(order: Order): Prisma.OrderUncheckedCreateInput {
    return {
      id: order.id.toString(),
      deliveredAt: order.deliveredAt,
      deliveryManId: order.deliveryManId?.toString(),
      recipientId: order.recipientId.toString(),
      status: order.status.value,
      title: order.title,
      createdAt: order.createdAt,
      deliveryPhotoUrl: order.deliveryPhotoUrl,
    }
  }
}