import { Either, left, right } from "@/core/either";
import { NotAllowedError } from "@/core/errors/use-cases/not-allowed-error";
import { ResourceNotFoundError } from "@/core/errors/use-cases/resource-not-found-error";
import { Injectable } from "@nestjs/common";
import { AdminsRepository } from "../repositories/admins-repository";
import { DeliveryMenRepository } from "../repositories/delivery-men-repository";

export interface DeleteDeliveryManUseCaseRequest {
  authorId: string;
  deliveryManId: string;
}

export type DeleteDeliveryManUseCaseResponse = Either<
  ResourceNotFoundError | NotAllowedError,
  {}
>

@Injectable()
export class DeleteDeliveryManUseCase {
  constructor(
    private deliveryMenRepository: DeliveryMenRepository,
    private adminsRepository: AdminsRepository,
  ) {}

  async execute({
    authorId,
    deliveryManId,
  }: DeleteDeliveryManUseCaseRequest): Promise<DeleteDeliveryManUseCaseResponse> {
    const admin = await this.adminsRepository.findById(authorId)

    if (!admin) {
      return left(new NotAllowedError())
    }

    const deliveryMan = await this.deliveryMenRepository.findById(deliveryManId)

    if (!deliveryMan) {
      return left(new ResourceNotFoundError())
    }

    await this.deliveryMenRepository.delete(deliveryMan)
    
    return right({})
  }
}