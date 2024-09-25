import { Either, left, right } from "@/core/either";
import { InvalidCredentialsError } from "@/core/errors/use-cases/invalid-credentials-error";
import { Injectable } from "@nestjs/common";
import { HashComparer } from "../cryptography/hash-comparer";
import { Encrypter } from "../cryptography/encrypter";
import { DeliveryMenRepository } from "../repositories/delivery-men-repository";

export interface AuthenticateDeliveryManUseCaseRequest {
  cpf: string;
  password: string;
}

export type AuthenticateDeliveryManUseCaseResponse = Either<
  InvalidCredentialsError,
  {
    token: string;
  }
>

@Injectable()
export class AuthenticateDeliveryManUseCase {
  constructor(
    private deliveryMenRepository: DeliveryMenRepository,
    private hashComparer: HashComparer,
    private encrypter: Encrypter,
  ) {}

  async execute({
    cpf,
    password,
  }: AuthenticateDeliveryManUseCaseRequest): Promise<AuthenticateDeliveryManUseCaseResponse> {
    const deliveryMan = await this.deliveryMenRepository.findByCPF(cpf)

    if (!deliveryMan) {
      return left(new InvalidCredentialsError())
    }

    const doesPasswordMatch = await this.hashComparer.compare(password, deliveryMan.password)

    if (!doesPasswordMatch) {
      return left(new InvalidCredentialsError())
    }
    
    const token = await this.encrypter.encrypt({
      sub: deliveryMan.id.toString(),
      role: 'DELIVERY_MAN',
    })

    return right({
      token,
    })
  }
}