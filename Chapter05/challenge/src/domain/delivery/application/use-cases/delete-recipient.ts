import { Either, left, right } from "@/core/either";
import { NotAllowedError } from "@/core/errors/use-cases/not-allowed-error";
import { ResourceNotFoundError } from "@/core/errors/use-cases/resource-not-found-error";
import { Injectable } from "@nestjs/common";
import { AdminsRepository } from "../repositories/admins-repository";
import { RecipientsRepository } from "../repositories/recipients-repository";

export interface DeleteRecipientUseCaseRequest {
  authorId: string;
  recipientId: string;
}

export type DeleteRecipientUseCaseResponse = Either<
  ResourceNotFoundError | NotAllowedError,
  {}
>

@Injectable()
export class DeleteRecipientUseCase {
  constructor(
    private recipientsRepository: RecipientsRepository,
    private adminsRepository: AdminsRepository,
  ) {}

  async execute({
    authorId,
    recipientId,
  }: DeleteRecipientUseCaseRequest): Promise<DeleteRecipientUseCaseResponse> {
    const admin = await this.adminsRepository.findById(authorId)

    if (!admin) {
      return left(new NotAllowedError())
    }

    const recipient = await this.recipientsRepository.findById(recipientId)

    if (!recipient) {
      return left(new ResourceNotFoundError())
    }

    await this.recipientsRepository.delete(recipient)
    
    return right({})
  }
}