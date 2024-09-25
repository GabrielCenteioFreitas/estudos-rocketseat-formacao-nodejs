
export type OrderStatusType = 'PENDING' | 'IN_TRANSIT' | 'DELIVERED' | 'RETURNED'

export class OrderStatus {
  public value: OrderStatusType

  private constructor(value: OrderStatusType) {
    this.value = value
  }

  static create(status: OrderStatusType = 'PENDING') {
    return new OrderStatus(status)
  }

  get toString() {
    return this.value
  }
}