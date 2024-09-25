import { Either, left, right } from "@/core/either";
import { NotAllowedError } from "@/core/errors/use-cases/not-allowed-error";
import { ResourceNotFoundError } from "@/core/errors/use-cases/resource-not-found-error";
import { Injectable } from "@nestjs/common";
import { Recipient } from "../../enterprise/entities/recipient";
import { AdminsRepository } from "../repositories/admins-repository";
import { RecipientsRepository } from "../repositories/recipients-repository";

export interface EditRecipientUseCaseRequest {
  authorId: string;
  recipientId: string;
  name: string;
}

export type EditRecipientUseCaseResponse = Either<
  ResourceNotFoundError | NotAllowedError,
  {
    recipient: Recipient
  }
>

@Injectable()
export class EditRecipientUseCase {
  constructor(
    private recipientsRepository: RecipientsRepository,
    private adminsRepository: AdminsRepository,
  ) {}

  async execute({
    authorId,
    recipientId,
    name,
  }: EditRecipientUseCaseRequest): Promise<EditRecipientUseCaseResponse> {
    const admin = await this.adminsRepository.findById(authorId)

    if (!admin) {
      return left(new NotAllowedError())
    }

    const recipient = await this.recipientsRepository.findById(recipientId)

    if (!recipient) {
      return left(new ResourceNotFoundError())
    }
    
    recipient.name = name

    await this.recipientsRepository.save(recipient)

    return right({
      recipient,
    })
  }
}