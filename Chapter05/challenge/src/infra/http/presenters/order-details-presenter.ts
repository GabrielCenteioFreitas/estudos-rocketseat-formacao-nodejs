import { OrderDetails } from "@/domain/delivery/enterprise/entities/value-objects/order-details";

export class OrderDetailsPresenter {
  static toHTTP(orderDetails: OrderDetails) {
    return {
      id: orderDetails.orderId.toString(),
      status: orderDetails.status.value,
      title: orderDetails.title,
      createdAt: orderDetails.createdAt,
      deliveredAt: orderDetails.deliveredAt,
      deliveryManId: orderDetails.deliveryManId?.toString(),
      deliveryPhotoUrl: orderDetails.deliveryPhotoUrl,
      location: orderDetails.location.getCoordinates(),
      recipient: {
        id: orderDetails.recipientId.toString(),
        name: orderDetails.recipient,
      },
    }
  }
}