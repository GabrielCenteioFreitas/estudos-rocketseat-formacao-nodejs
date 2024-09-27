import { Either, left, right } from "@/core/either";
import { InvalidCredentialsError } from "@/core/errors/use-cases/invalid-credentials-error";
import { Role } from "@/core/types/roles";
import { Injectable } from "@nestjs/common";
import { Encrypter } from "../cryptography/encrypter";
import { HashComparer } from "../cryptography/hash-comparer";
import { AdminsRepository } from "../repositories/admins-repository";

export interface AuthenticateAdminUseCaseRequest {
  cpf: string;
  password: string;
}

export type AuthenticateAdminUseCaseResponse = Either<
  InvalidCredentialsError,
  {
    token: string;
  }
>

@Injectable()
export class AuthenticateAdminUseCase {
  constructor(
    private adminsRepository: AdminsRepository,
    private hashComparer: HashComparer,
    private encrypter: Encrypter,
  ) {}

  async execute({
    cpf,
    password,
  }: AuthenticateAdminUseCaseRequest): Promise<AuthenticateAdminUseCaseResponse> {
    const admin = await this.adminsRepository.findByCPF(cpf)

    if (!admin) {
      return left(new InvalidCredentialsError())
    }

    const doesPasswordMatch = await this.hashComparer.compare(password, admin.password)

    if (!doesPasswordMatch) {
      return left(new InvalidCredentialsError())
    }
    
    const token = await this.encrypter.encrypt({
      sub: admin.id.toString(),
      role: Role.Admin,
    })

    return right({
      token,
    })
  }
}