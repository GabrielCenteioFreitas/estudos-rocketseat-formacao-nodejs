import { Either, left, right } from "@/core/either";
import { NotAllowedError } from "@/core/errors/use-cases/not-allowed-error";
import { ResourceNotFoundError } from "@/core/errors/use-cases/resource-not-found-error";
import { Injectable } from "@nestjs/common";
import { Order } from "../../enterprise/entities/order";
import { OrderStatus } from "../../enterprise/entities/value-objects/order-status";
import { DeliveryMenRepository } from "../repositories/delivery-men-repository";
import { OrdersRepository } from "../repositories/orders-repository";
import { UniqueEntityID } from "@/core/entities/unique-entity-id";

export interface MarkOrderAsDeliveredUseCaseRequest {
  authorId: string;
  orderId: string;
  deliveryPhotoUrl: string;
}

export type MarkOrderAsDeliveredUseCaseResponse = Either<
  NotAllowedError | ResourceNotFoundError,
  {
    order: Order,
  }
>

@Injectable()
export class MarkOrderAsDeliveredUseCase {
  constructor(
    private ordersRepository: OrdersRepository,
    private deliveryMenRepository: DeliveryMenRepository,
  ) {}

  async execute({
    orderId,
    authorId,
    deliveryPhotoUrl,
  }: MarkOrderAsDeliveredUseCaseRequest): Promise<MarkOrderAsDeliveredUseCaseResponse> {
    const deliveryMan = await this.deliveryMenRepository.findById(authorId)

    if (!deliveryMan) {
      return left(new NotAllowedError())
    }

    const order = await this.ordersRepository.findById(orderId)

    if (!order) {
      return left(new ResourceNotFoundError())
    }

    if (!order.deliveryManId?.equals(new UniqueEntityID(authorId))) {
      return left(new NotAllowedError())
    }

    order.status = OrderStatus.create('DELIVERED')
    order.deliveredAt = new Date()
    order.deliveryPhotoUrl = deliveryPhotoUrl

    await this.ordersRepository.save(order)

    return right({
      order,
    })
  }
}