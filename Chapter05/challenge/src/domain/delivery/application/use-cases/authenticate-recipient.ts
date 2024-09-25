import { Either, left, right } from "@/core/either";
import { InvalidCredentialsError } from "@/core/errors/use-cases/invalid-credentials-error";
import { Injectable } from "@nestjs/common";
import { HashComparer } from "../cryptography/hash-comparer";
import { RecipientsRepository } from "../repositories/recipients-repository";
import { Encrypter } from "../cryptography/encrypter";

export interface AuthenticateRecipientUseCaseRequest {
  cpf: string;
  password: string;
}

export type AuthenticateRecipientUseCaseResponse = Either<
  InvalidCredentialsError,
  {
    token: string;
  }
>

@Injectable()
export class AuthenticateRecipientUseCase {
  constructor(
    private recipientsRepository: RecipientsRepository,
    private hashComparer: HashComparer,
    private encrypter: Encrypter,
  ) {}

  async execute({
    cpf,
    password,
  }: AuthenticateRecipientUseCaseRequest): Promise<AuthenticateRecipientUseCaseResponse> {
    const recipient = await this.recipientsRepository.findByCPF(cpf)

    if (!recipient) {
      return left(new InvalidCredentialsError())
    }

    const doesPasswordMatch = await this.hashComparer.compare(password, recipient.password)

    if (!doesPasswordMatch) {
      return left(new InvalidCredentialsError())
    }
    
    const token = await this.encrypter.encrypt({
      sub: recipient.id.toString(),
      role: 'RECIPIENT',
    })

    return right({
      token,
    })
  }
}