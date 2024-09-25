import { Either, left, right } from "@/core/either";
import { NotAllowedError } from "@/core/errors/use-cases/not-allowed-error";
import { ResourceNotFoundError } from "@/core/errors/use-cases/resource-not-found-error";
import { Injectable } from "@nestjs/common";
import { DeliveryMan } from "../../enterprise/entities/delivery-man";
import { Location } from "../../enterprise/entities/value-objects/location";
import { AdminsRepository } from "../repositories/admins-repository";
import { DeliveryMenRepository } from "../repositories/delivery-men-repository";

export interface GetDeliveryManUseCaseRequest {
  authorId: string;
  deliveryManId: string;
}

export type GetDeliveryManUseCaseResponse = Either<
  ResourceNotFoundError | NotAllowedError,
  {
    deliveryMan: DeliveryMan
  }
>

@Injectable()
export class GetDeliveryManUseCase {
  constructor(
    private deliveryMenRepository: DeliveryMenRepository,
    private adminsRepository: AdminsRepository,
  ) {}

  async execute({
    authorId,
    deliveryManId,
  }: GetDeliveryManUseCaseRequest): Promise<GetDeliveryManUseCaseResponse> {
    const admin = await this.adminsRepository.findById(authorId)

    if (!admin) {
      return left(new NotAllowedError())
    }

    const deliveryMan = await this.deliveryMenRepository.findById(deliveryManId)

    if (!deliveryMan) {
      return left(new ResourceNotFoundError())
    }
    
    return right({
      deliveryMan,
    })
  }
}