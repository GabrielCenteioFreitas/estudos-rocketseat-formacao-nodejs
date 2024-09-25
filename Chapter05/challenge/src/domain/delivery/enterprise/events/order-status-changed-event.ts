import { UniqueEntityID } from "@/core/entities/unique-entity-id";
import { DomainEvent } from "@/core/events/domain-event";
import { Order } from "../entities/order";
import { OrderStatus } from "../entities/value-objects/order-status";

export class OrderStatusChangedEvent implements DomainEvent {
  public ocurredAt: Date;
  public prevStatus: OrderStatus;
  public order: Order;

  constructor(order: Order, prevStatus: OrderStatus) {
    this.order = order;
    this.prevStatus = prevStatus;
    this.ocurredAt = new Date()
  }

  public getAggregateId(): UniqueEntityID {
    return this.order.id
  }
}