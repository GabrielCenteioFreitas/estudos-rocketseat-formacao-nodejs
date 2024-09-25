import { UniqueEntityID } from "@/core/entities/unique-entity-id";
import { ValueObject } from "@/core/entities/value-object";
import { Location } from "./location";
import { OrderStatus } from "./order-status";

export interface OrderDetailsProps {
  orderId: UniqueEntityID;
  deliveryManId?: UniqueEntityID | null;
  recipientId: UniqueEntityID;
  title: string;
  status: OrderStatus;
  recipient: string;
  location: Location;
  createdAt: Date;
  deliveredAt?: Date | null;
  deliveryPhotoUrl?: string | null;
}

export class OrderDetails extends ValueObject<OrderDetailsProps> {
  get orderId() {
    return this.props.orderId
  }

  get deliveryManId() {
    return this.props.deliveryManId
  }
  
  get recipientId() {
    return this.props.recipientId
  }

  get title() {
    return this.props.title
  }

  get status() {
    return this.props.status
  }
  
  get recipient() {
    return this.props.recipient
  }
  
  get location() {
    return this.props.location
  }
  
  get createdAt() {
    return this.props.createdAt
  }
  
  get deliveredAt() {
    return this.props.deliveredAt
  }
  
  get deliveryPhotoUrl() {
    return this.props.deliveryPhotoUrl
  }

  static create(props: OrderDetailsProps) {
    return new OrderDetails(props)
  }
}