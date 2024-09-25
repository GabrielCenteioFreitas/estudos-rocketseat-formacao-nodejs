import { Either, left, right } from "@/core/either";
import { CpfAlreadyInUseError } from "@/core/errors/use-cases/cpf-already-in-use-error";
import { Injectable } from "@nestjs/common";
import { Admin } from "../../enterprise/entities/admin";
import { CPF } from "../../enterprise/entities/value-objects/cpf";
import { HashGenerator } from "../cryptography/hash-generator";
import { AdminsRepository } from "../repositories/admins-repository";

export interface RegisterAdminUseCaseRequest {
  name: string;
  cpf: string;
  password: string;
}

export type RegisterAdminUseCaseResponse = Either<
  CpfAlreadyInUseError,
  {
    admin: Admin;
  }
>

@Injectable()
export class RegisterAdminUseCase {
  constructor(
    private adminsRepository: AdminsRepository,
    private hashGenerator: HashGenerator,
  ) {}

  async execute({
    name,
    cpf,
    password,
  }: RegisterAdminUseCaseRequest): Promise<RegisterAdminUseCaseResponse> {
    const adminWithSameCPF = await this.adminsRepository.findByCPF(cpf)

    if (adminWithSameCPF) {
      return left(new CpfAlreadyInUseError(cpf.toString()))
    }

    const hashedPassword = await this.hashGenerator.hash(password)

    const admin = Admin.create({
      name,
      cpf: CPF.create(cpf),
      password: hashedPassword,
    })

    await this.adminsRepository.create(admin)

    return right({
      admin,
    })
  }
}