import { Either, left, right } from "@/core/either";
import { ResourceNotFoundError } from "@/core/errors/use-cases/resource-not-found-error";
import { Injectable } from "@nestjs/common";
import { OrderDetails } from "../../enterprise/entities/value-objects/order-details";
import { OrdersRepository } from "../repositories/orders-repository";
import { AdminsRepository } from "../repositories/admins-repository";
import { DeliveryMenRepository } from "../repositories/delivery-men-repository";
import { NotAllowedError } from "@/core/errors/use-cases/not-allowed-error";
import { Order } from "../../enterprise/entities/order";

export interface FetchDeliveryManOrdersUseCaseRequest {
  authorId: string;
  deliveryManId: string;
}

export type FetchDeliveryManOrdersUseCaseResponse = Either<
  NotAllowedError | ResourceNotFoundError,
  {
    orders: Order[],
  }
>

@Injectable()
export class FetchDeliveryManOrdersUseCase {
  constructor(
    private ordersRepository: OrdersRepository,
    private adminsRepository: AdminsRepository,
    private deliveryMenRepository: DeliveryMenRepository,
  ) {}

  async execute({
    authorId,
    deliveryManId,
  }: FetchDeliveryManOrdersUseCaseRequest): Promise<FetchDeliveryManOrdersUseCaseResponse> {
    const deliveryMan = await this.deliveryMenRepository.findById(deliveryManId)

    if (!deliveryMan) {
      return left(new ResourceNotFoundError())
    }

    if (deliveryManId !== authorId) {
      const isAuthorAdmin = await this.adminsRepository.findById(authorId)

      if (!isAuthorAdmin) {
        return left(new NotAllowedError())
      }
    }

    const orders = await this.ordersRepository.findManyByDeliveryManId(deliveryManId)

    return right({
      orders,
    })
  }
}