import { Either, left, right } from "@/core/either";
import { UniqueEntityID } from "@/core/entities/unique-entity-id";
import { NotAllowedError } from "@/core/errors/use-cases/not-allowed-error";
import { Injectable } from "@nestjs/common";
import { Order } from "../../enterprise/entities/order";
import { OrderStatus } from "../../enterprise/entities/value-objects/order-status";
import { AdminsRepository } from "../repositories/admins-repository";
import { OrdersRepository } from "../repositories/orders-repository";
import { RecipientsRepository } from "../repositories/recipients-repository";
import { ResourceNotFoundError } from "@/core/errors/use-cases/resource-not-found-error";

export interface EditOrderUseCaseRequest {
  orderId: string;
  authorId: string;
  recipientId: string;
  title: string;
}

export type EditOrderUseCaseResponse = Either<
  NotAllowedError | ResourceNotFoundError,
  {
    order: Order;
  }
>

@Injectable()
export class EditOrderUseCase {
  constructor(
    private ordersRepository: OrdersRepository,
    private adminsRepository: AdminsRepository,
    private recipientsRepository: RecipientsRepository,
  ) {}

  async execute({
    orderId,
    authorId,
    recipientId,
    title,
  }: EditOrderUseCaseRequest): Promise<EditOrderUseCaseResponse> {
    const admin = await this.adminsRepository.findById(authorId)

    if (!admin) {
      return left(new NotAllowedError())
    }

    const order = await this.ordersRepository.findById(orderId)

    if (!order) {
      return left(new ResourceNotFoundError())
    }

    const isTheSameRecipient = order.recipientId.equals(new UniqueEntityID(recipientId))
    if (!isTheSameRecipient) {
      const recipient = await this.recipientsRepository.findById(recipientId)

      if (!recipient) {
        return left(new ResourceNotFoundError())
      }

      order.recipientId = new UniqueEntityID(recipientId)
    }

    order.title = title

    await this.ordersRepository.save(order)

    return right({
      order,
    })
  }
}