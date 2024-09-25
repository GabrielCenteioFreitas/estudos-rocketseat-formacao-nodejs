import { UniqueEntityID } from "@/core/entities/unique-entity-id";
import { Order, OrderProps } from "@/domain/delivery/enterprise/entities/order";
import { OrderStatus } from "@/domain/delivery/enterprise/entities/value-objects/order-status";
import { faker } from "@faker-js/faker";

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