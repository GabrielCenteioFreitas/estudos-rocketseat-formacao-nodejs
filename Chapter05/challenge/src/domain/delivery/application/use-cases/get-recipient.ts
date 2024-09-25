import { Either, left, right } from "@/core/either";
import { NotAllowedError } from "@/core/errors/use-cases/not-allowed-error";
import { ResourceNotFoundError } from "@/core/errors/use-cases/resource-not-found-error";
import { Injectable } from "@nestjs/common";
import { Recipient } from "../../enterprise/entities/recipient";
import { AdminsRepository } from "../repositories/admins-repository";
import { RecipientsRepository } from "../repositories/recipients-repository";

export interface GetRecipientUseCaseRequest {
  authorId: string;
  recipientId: string;
}

export type GetRecipientUseCaseResponse = Either<
  ResourceNotFoundError | NotAllowedError,
  {
    recipient: Recipient
  }
>

@Injectable()
export class GetRecipientUseCase {
  constructor(
    private recipientsRepository: RecipientsRepository,
    private adminsRepository: AdminsRepository,
  ) {}

  async execute({
    authorId,
    recipientId,
  }: GetRecipientUseCaseRequest): Promise<GetRecipientUseCaseResponse> {
    const admin = await this.adminsRepository.findById(authorId)

    if (!admin) {
      return left(new NotAllowedError())
    }

    const recipient = await this.recipientsRepository.findById(recipientId)

    if (!recipient) {
      return left(new ResourceNotFoundError())
    }
    
    return right({
      recipient,
    })
  }
}