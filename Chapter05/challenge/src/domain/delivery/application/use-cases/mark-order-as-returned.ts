import { Either, left, right } from "@/core/either";
import { UniqueEntityID } from "@/core/entities/unique-entity-id";
import { NotAllowedError } from "@/core/errors/use-cases/not-allowed-error";
import { ResourceNotFoundError } from "@/core/errors/use-cases/resource-not-found-error";
import { Injectable } from "@nestjs/common";
import { Order } from "../../enterprise/entities/order";
import { OrderStatus } from "../../enterprise/entities/value-objects/order-status";
import { AdminsRepository } from "../repositories/admins-repository";
import { OrdersRepository } from "../repositories/orders-repository";

export interface MarkOrderAsReturnedUseCaseRequest {
  authorId: string;
  orderId: string;
}

export type MarkOrderAsReturnedUseCaseResponse = Either<
  NotAllowedError | ResourceNotFoundError,
  {
    order: Order,
  }
>

@Injectable()
export class MarkOrderAsReturnedUseCase {
  constructor(
    private ordersRepository: OrdersRepository,
    private adminsRepository: AdminsRepository,
  ) {}

  async execute({
    orderId,
    authorId,
  }: MarkOrderAsReturnedUseCaseRequest): Promise<MarkOrderAsReturnedUseCaseResponse> {
    const admin = await this.adminsRepository.findById(authorId)

    if (!admin) {
      return left(new NotAllowedError())
    }

    const order = await this.ordersRepository.findById(orderId)

    if (!order) {
      return left(new ResourceNotFoundError())
    }

    order.status = OrderStatus.create('RETURNED')

    await this.ordersRepository.save(order)

    return right({
      order,
    })
  }
}