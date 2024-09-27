import { AggregateRoot } from "@/core/entities/aggregate-root";
import { UniqueEntityID } from "@/core/entities/unique-entity-id";
import { OrderStatus } from "./value-objects/order-status";
import { OrderStatusChangedEvent } from "../events/order-status-changed-event";

export interface OrderProps {
  recipientId: UniqueEntityID;
  title: string;
  status: OrderStatus;
  createdAt: Date;
  deliveryManId?: UniqueEntityID | null;
  deliveredAt?: Date | null;
  deliveryPhotoUrl?: string | null;
}

export class Order extends AggregateRoot<OrderProps> {
  get recipientId() {
    return this.props.recipientId
  }

  get deliveryManId() {
    return this.props.deliveryManId ?? null
  }
  
  get title() {
    return this.props.title
  }
  
  get status() {
    return this.props.status
  }
  
  get createdAt() {
    return this.props.createdAt
  }
  
  get deliveredAt() {
    return this.props.deliveredAt ?? null
  }
  
  get deliveryPhotoUrl() {
    return this.props.deliveryPhotoUrl ?? null
  }

  set recipientId(recipientId: UniqueEntityID) {
    this.props.recipientId = recipientId
  }

  set deliveryManId(deliveryManId: UniqueEntityID | null) {
    this.props.deliveryManId = deliveryManId
  }
  
  set title(title: string) {
    this.props.title = title
  }
  
  set status(status: OrderStatus) {
    const prevStatus = this.props.status

    this.props.status = status

    if (prevStatus !== status) {
      this.addDomainEvent(
        new OrderStatusChangedEvent(this, prevStatus)
      )
    }
  }
  
  set deliveredAt(deliveredAt: Date | null) {
    this.props.deliveredAt = deliveredAt
  }
  
  set deliveryPhotoUrl(deliveryPhotoUrl: string | null) {
    this.props.deliveryPhotoUrl = deliveryPhotoUrl
  }
  
  static create(props: OrderProps, id?: UniqueEntityID) {
    const order = new Order(props, id)

    return order
  }
}