import { Either, left, right } from "@/core/either";
import { NotAllowedError } from "@/core/errors/use-cases/not-allowed-error";
import { ResourceNotFoundError } from "@/core/errors/use-cases/resource-not-found-error";
import { Injectable } from "@nestjs/common";
import { DeliveryMan } from "../../enterprise/entities/delivery-man";
import { AdminsRepository } from "../repositories/admins-repository";
import { DeliveryMenRepository } from "../repositories/delivery-men-repository";
import { InvalidCredentialsError } from "@/core/errors/use-cases/invalid-credentials-error";
import { HashComparer } from "../cryptography/hash-comparer";
import { HashGenerator } from "../cryptography/hash-generator";

export interface ChangeDeliveryManPasswordUseCaseRequest {
  authorId: string;
  deliveryManId: string;
  password: string;
  newPassword: string;
}

export type ChangeDeliveryManPasswordUseCaseResponse = Either<
  ResourceNotFoundError | NotAllowedError | InvalidCredentialsError,
  {
    deliveryMan: DeliveryMan
  }
>

@Injectable()
export class ChangeDeliveryManPasswordUseCase {
  constructor(
    private adminsRepository: AdminsRepository,
    private deliveryMenRepository: DeliveryMenRepository,
    private hashComparer: HashComparer,
    private hashGenerator: HashGenerator,
  ) {}

  async execute({
    authorId,
    deliveryManId,
    password,
    newPassword,
  }: ChangeDeliveryManPasswordUseCaseRequest): Promise<ChangeDeliveryManPasswordUseCaseResponse> {
    const admin = await this.adminsRepository.findById(authorId)

    if (!admin) {
      return left(new NotAllowedError())
    }

    const deliveryMan = await this.deliveryMenRepository.findById(deliveryManId)

    if (!deliveryMan) {
      return left(new ResourceNotFoundError())
    }

    const doesPasswordMatch = await this.hashComparer.compare(password, deliveryMan.password)
    if (!doesPasswordMatch) {
      return left(new InvalidCredentialsError())
    }
    
    deliveryMan.password = await this.hashGenerator.hash(newPassword)

    await this.deliveryMenRepository.save(deliveryMan)

    return right({
      deliveryMan,
    })
  }
}