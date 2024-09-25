import { Either, left, right } from "@/core/either";
import { NotAllowedError } from "@/core/errors/use-cases/not-allowed-error";
import { ResourceNotFoundError } from "@/core/errors/use-cases/resource-not-found-error";
import { Injectable } from "@nestjs/common";
import { AdminsRepository } from "../repositories/admins-repository";
import { OrdersRepository } from "../repositories/orders-repository";

export interface DeleteOrderUseCaseRequest {
  orderId: string;
  authorId: string;
}

export type DeleteOrderUseCaseResponse = Either<
  NotAllowedError | ResourceNotFoundError,
  {}
>

@Injectable()
export class DeleteOrderUseCase {
  constructor(
    private ordersRepository: OrdersRepository,
    private adminsRepository: AdminsRepository,
  ) {}

  async execute({
    orderId,
    authorId,
  }: DeleteOrderUseCaseRequest): Promise<DeleteOrderUseCaseResponse> {
    const admin = await this.adminsRepository.findById(authorId)

    if (!admin) {
      return left(new NotAllowedError())
    }

    const order = await this.ordersRepository.findById(orderId)

    if (!order) {
      return left(new ResourceNotFoundError())
    }

    await this.ordersRepository.delete(order)

    return right({})
  }
}