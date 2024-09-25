import { Either, left, right } from "@/core/either";
import { UniqueEntityID } from "@/core/entities/unique-entity-id";
import { NotAllowedError } from "@/core/errors/use-cases/not-allowed-error";
import { ResourceNotFoundError } from "@/core/errors/use-cases/resource-not-found-error";
import { Injectable } from "@nestjs/common";
import { Order } from "../../enterprise/entities/order";
import { OrderStatus } from "../../enterprise/entities/value-objects/order-status";
import { DeliveryMenRepository } from "../repositories/delivery-men-repository";
import { OrdersRepository } from "../repositories/orders-repository";

export interface MarkOrderAsInTransitUseCaseRequest {
  authorId: string;
  orderId: string;
}

export type MarkOrderAsInTransitUseCaseResponse = Either<
  NotAllowedError | ResourceNotFoundError,
  {
    order: Order,
  }
>

@Injectable()
export class MarkOrderAsInTransitUseCase {
  constructor(
    private ordersRepository: OrdersRepository,
    private deliveryMenRepository: DeliveryMenRepository,
  ) {}

  async execute({
    orderId,
    authorId,
  }: MarkOrderAsInTransitUseCaseRequest): Promise<MarkOrderAsInTransitUseCaseResponse> {
    const deliveryMan = await this.deliveryMenRepository.findById(authorId)

    if (!deliveryMan) {
      return left(new NotAllowedError())
    }

    const order = await this.ordersRepository.findById(orderId)

    if (!order) {
      return left(new ResourceNotFoundError())
    }

    order.status = OrderStatus.create('IN_TRANSIT')
    order.deliveryManId = new UniqueEntityID(authorId)

    await this.ordersRepository.save(order)

    return right({
      order,
    })
  }
}