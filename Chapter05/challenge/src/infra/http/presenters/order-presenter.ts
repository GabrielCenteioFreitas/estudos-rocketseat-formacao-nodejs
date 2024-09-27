import { Order } from "@/domain/delivery/enterprise/entities/order";

export class OrderPresenter {
  static toHTTP(order: Order) {
    return {
      id: order.id.toString(),
      status: order.status.value,
      title: order.title,
      createdAt: order.createdAt,
      deliveredAt: order.deliveredAt,
      deliveryManId: order.deliveryManId?.toString(),
      deliveryPhotoUrl: order.deliveryPhotoUrl,
    }
  }
}