import { UniqueEntityID } from "@/core/entities/unique-entity-id";
import { OrdersRepository } from "@/domain/delivery/application/repositories/orders-repository";
import { RecipientsRepository } from "@/domain/delivery/application/repositories/recipients-repository";
import { Order } from "@/domain/delivery/enterprise/entities/order";
import { OrderDetails } from "@/domain/delivery/enterprise/entities/value-objects/order-details";
import { InMemoryRecipientsRepository } from "./in-memory-recipients-repository";

export class InMemoryOrdersRepository implements OrdersRepository {
  public items: Order[] = [];

  constructor(
    private recipientsRepository: InMemoryRecipientsRepository,
  ) {}

  async create(order: Order): Promise<void> {
    this.items.push(order)
  }
  
  async delete(order: Order): Promise<void> {
    const itemIndex = this.items.findIndex((item) => item.id.equals(order.id))

    
    this.items.splice(itemIndex, 1)
  }

  async save(order: Order): Promise<void> {
    const itemIndex = this.items.findIndex((item) => item.id.equals(order.id))

    this.items[itemIndex] = order
  }
  
  async findById(id: string): Promise<Order | null> {
    const order = this.items.find(item => item.id.equals(new UniqueEntityID(id)))

    return order ?? null
  }
  
  async findDetailsById(id: string): Promise<OrderDetails | null> {
    const order = this.items.find(item => item.id.equals(new UniqueEntityID(id)))

    if (!order) {
      return null
    }

    const recipient = await this.recipientsRepository.findById(order.recipientId.toString())

    if (!recipient) {
      return null
    }

    return OrderDetails.create({
      orderId: order.id,
      recipientId: recipient.id,
      deliveryManId: order.deliveryManId,
      title: order.title,
      status: order.status,
      recipient: recipient.name,
      location: recipient.location,
      createdAt: order.createdAt,
      deliveredAt: order.deliveredAt,
      deliveryPhotoUrl: order.deliveryPhotoUrl,
    })
  }

  async findByDeliveryManId(deliveryManId: string): Promise<OrderDetails[]> {
    const orders = this.items.filter(item => item.deliveryManId.equals(new UniqueEntityID(deliveryManId)))

    const ordersDetails = orders.map((order) => {
      const recipient = this.recipientsRepository.items.find((item) => item.id.equals(order.recipientId))

      if (!recipient) {
        return null
      }

      return OrderDetails.create({
        orderId: order.id,
        recipientId: recipient.id,
        deliveryManId: order.deliveryManId,
        title: order.title,
        status: order.status,
        recipient: recipient.name,
        location: recipient.location,
        createdAt: order.createdAt,
        deliveredAt: order.deliveredAt,
        deliveryPhotoUrl: order.deliveryPhotoUrl,
      })
    })

    return ordersDetails
  }
}