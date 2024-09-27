import { UniqueEntityID } from "@/core/entities/unique-entity-id";
import { Location } from "@/domain/delivery/enterprise/entities/value-objects/location";
import { OrderDetails } from "@/domain/delivery/enterprise/entities/value-objects/order-details";
import { OrderStatus } from "@/domain/delivery/enterprise/entities/value-objects/order-status";
import { Order as PrismaOrder, User as PrismaUser } from "@prisma/client";

type PrismaOrderDetails = PrismaOrder & {
  recipient: PrismaUser;
}

export class PrismaOrderDetailsMapper {
  static toDomain(raw: PrismaOrderDetails): OrderDetails {
    if (!raw.recipient.latitude || !raw.recipient.longitude) {
      throw new Error()
    }

    return OrderDetails.create({
      createdAt: raw.createdAt,
      location: Location.create({
        latitude: raw.recipient.latitude?.toNumber(),
        longitude: raw.recipient.longitude?.toNumber(),
      }),
      orderId: new UniqueEntityID(raw.id),
      recipient: raw.recipient.name,
      recipientId: new UniqueEntityID(raw.recipientId),
      status: OrderStatus.create(raw.status),
      title: raw.title, 
      deliveredAt: raw.deliveredAt,
      deliveryManId: raw.deliveryManId ? new UniqueEntityID(raw.deliveryManId) : null,
      deliveryPhotoUrl: raw.deliveryPhotoUrl,
    })
  }
}