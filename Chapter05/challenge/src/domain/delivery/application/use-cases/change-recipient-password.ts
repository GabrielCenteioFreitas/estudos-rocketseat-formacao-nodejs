import { Either, left, right } from "@/core/either";
import { NotAllowedError } from "@/core/errors/use-cases/not-allowed-error";
import { ResourceNotFoundError } from "@/core/errors/use-cases/resource-not-found-error";
import { Injectable } from "@nestjs/common";
import { Recipient } from "../../enterprise/entities/recipient";
import { AdminsRepository } from "../repositories/admins-repository";
import { RecipientsRepository } from "../repositories/recipients-repository";
import { InvalidCredentialsError } from "@/core/errors/use-cases/invalid-credentials-error";
import { HashComparer } from "../cryptography/hash-comparer";
import { HashGenerator } from "../cryptography/hash-generator";

export interface ChangeRecipientPasswordUseCaseRequest {
  authorId: string;
  recipientId: string;
  password: string;
  newPassword: string;
}

export type ChangeRecipientPasswordUseCaseResponse = Either<
  ResourceNotFoundError | NotAllowedError | InvalidCredentialsError,
  {
    recipient: Recipient
  }
>

@Injectable()
export class ChangeRecipientPasswordUseCase {
  constructor(
    private adminsRepository: AdminsRepository,
    private recipientsRepository: RecipientsRepository,
    private hasher: HashComparer & HashGenerator,
  ) {}

  async execute({
    authorId,
    recipientId,
    password,
    newPassword,
  }: ChangeRecipientPasswordUseCaseRequest): Promise<ChangeRecipientPasswordUseCaseResponse> {
    const admin = await this.adminsRepository.findById(authorId)

    if (!admin) {
      return left(new NotAllowedError())
    }

    const recipient = await this.recipientsRepository.findById(recipientId)

    if (!recipient) {
      return left(new ResourceNotFoundError())
    }

    const doesPasswordMatch = await this.hasher.compare(password, recipient.password)
    if (!doesPasswordMatch) {
      return left(new InvalidCredentialsError())
    }
    
    recipient.password = await this.hasher.hash(newPassword)

    await this.recipientsRepository.save(recipient)

    return right({
      recipient,
    })
  }
}