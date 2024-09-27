import { Either, left, right } from "@/core/either";
import { InvalidCredentialsError } from "@/core/errors/use-cases/invalid-credentials-error";
import { NotAllowedError } from "@/core/errors/use-cases/not-allowed-error";
import { ResourceNotFoundError } from "@/core/errors/use-cases/resource-not-found-error";
import { Injectable } from "@nestjs/common";
import { Admin } from "../../enterprise/entities/admin";
import { HashComparer } from "../cryptography/hash-comparer";
import { HashGenerator } from "../cryptography/hash-generator";
import { AdminsRepository } from "../repositories/admins-repository";

export interface ChangeAdminPasswordUseCaseRequest {
  authorId: string;
  adminId: string;
  password: string;
  newPassword: string;
}

export type ChangeAdminPasswordUseCaseResponse = Either<
  NotAllowedError | ResourceNotFoundError | InvalidCredentialsError,
  {
    admin: Admin,
  }
>

@Injectable()
export class ChangeAdminPasswordUseCase {
  constructor(
    private adminsRepository: AdminsRepository,
    private hashComparer: HashComparer,
    private hashGenerator: HashGenerator,
  ) {}

  async execute({
    authorId,
    adminId,
    password,
    newPassword,
  }: ChangeAdminPasswordUseCaseRequest): Promise<ChangeAdminPasswordUseCaseResponse> {
    if (adminId !== authorId) {
      return left(new NotAllowedError())
    }

    const admin = await this.adminsRepository.findById(adminId)

    if (!admin) {
      return left(new ResourceNotFoundError())
    }

    const doesPasswordMatch = await this.hashComparer.compare(password, admin.password)
    if (!doesPasswordMatch) {
      return left(new InvalidCredentialsError())
    }
    
    admin.password = await this.hashGenerator.hash(newPassword)

    await this.adminsRepository.save(admin)

    return right({
      admin,
    })
  }
}