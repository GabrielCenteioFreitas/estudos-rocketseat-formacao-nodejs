import { Either, left, right } from "@/core/either";
import { CpfAlreadyInUseError } from "@/core/errors/use-cases/cpf-already-in-use-error";
import { Injectable } from "@nestjs/common";
import { Recipient } from "../../enterprise/entities/recipient";
import { CPF } from "../../enterprise/entities/value-objects/cpf";
import { HashGenerator } from "../cryptography/hash-generator";
import { RecipientsRepository } from "../repositories/recipients-repository";

export interface RegisterRecipientUseCaseRequest {
  name: string;
  cpf: string;
  password: string;
}

export type RegisterRecipientUseCaseResponse = Either<
  CpfAlreadyInUseError,
  {
    recipient: Recipient;
  }
>

@Injectable()
export class RegisterRecipientUseCase {
  constructor(
    private recipientsRepository: RecipientsRepository,
    private hashGenerator: HashGenerator,
  ) {}

  async execute({
    name,
    cpf,
    password,
  }: RegisterRecipientUseCaseRequest): Promise<RegisterRecipientUseCaseResponse> {
    const recipientWithSameCPF = await this.recipientsRepository.findByCPF(cpf)

    if (recipientWithSameCPF) {
      return left(new CpfAlreadyInUseError(cpf.toString()))
    }

    const hashedPassword = await this.hashGenerator.hash(password)

    const recipient = Recipient.create({
      name,
      cpf: CPF.create(cpf),
      password: hashedPassword,
    })

    await this.recipientsRepository.create(recipient)

    return right({
      recipient,
    })
  }
}