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

export interface CreateOrderUseCaseRequest {
  authorId: string;
  recipientId: string;
  title: string;
}

export type CreateOrderUseCaseResponse = Either<
  NotAllowedError | ResourceNotFoundError,
  {
    order: Order;
  }
>

@Injectable()
export class CreateOrderUseCase {
  constructor(
    private ordersRepository: OrdersRepository,
    private adminsRepository: AdminsRepository,
    private recipientsRepository: RecipientsRepository,
  ) {}

  async execute({
    authorId,
    recipientId,
    title,
  }: CreateOrderUseCaseRequest): Promise<CreateOrderUseCaseResponse> {
    const admin = await this.adminsRepository.findById(authorId)

    if (!admin) {
      return left(new NotAllowedError())
    }

    const recipient = await this.recipientsRepository.findById(recipientId)

    if (!recipient) {
      return left(new ResourceNotFoundError())
    }

    const order = Order.create({
      title,
      recipientId: new UniqueEntityID(recipientId),
      createdAt: new Date(),
      status: OrderStatus.create('PENDING'),
    })

    await this.ordersRepository.create(order)

    return right({
      order,
    })
  }
}