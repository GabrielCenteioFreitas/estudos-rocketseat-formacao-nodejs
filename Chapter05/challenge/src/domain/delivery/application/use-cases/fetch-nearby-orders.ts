import { Either, left, right } from "@/core/either";
import { NotAllowedError } from "@/core/errors/use-cases/not-allowed-error";
import { ResourceNotFoundError } from "@/core/errors/use-cases/resource-not-found-error";
import { Injectable } from "@nestjs/common";
import { Order } from "../../enterprise/entities/order";
import { DeliveryMenRepository } from "../repositories/delivery-men-repository";
import { OrdersRepository } from "../repositories/orders-repository";

export interface FetchNearbyOrdersUseCaseRequest {
  authorId: string;
  deliveryManId: string;
}

export type FetchNearbyOrdersUseCaseResponse = Either<
  NotAllowedError | ResourceNotFoundError,
  {
    orders: Order[],
  }
>

@Injectable()
export class FetchNearbyOrdersUseCase {
  constructor(
    private ordersRepository: OrdersRepository,
    private deliveryMenRepository: DeliveryMenRepository,
  ) {}

  async execute({
    authorId,
    deliveryManId,
  }: FetchNearbyOrdersUseCaseRequest): Promise<FetchNearbyOrdersUseCaseResponse> {
    if (authorId !== deliveryManId) {
      return left(new NotAllowedError())
    }

    const deliveryMan = await this.deliveryMenRepository.findById(deliveryManId)

    if (!deliveryMan) {
      return left(new ResourceNotFoundError())
    }

    const coordinates = deliveryMan.location.getCoordinates()
    const orders = await this.ordersRepository.findManyNearby(coordinates)

    return right({
      orders,
    })
  }
}