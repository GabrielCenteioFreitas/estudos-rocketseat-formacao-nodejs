import { UsersRepository } from "@/repositories/users-repository";
import { User } from "@prisma/client";
import { compare } from "bcryptjs";
import { InvalidCredentialsError } from "./errors/invalid-credentials-error";

interface LoginAsAnUserServiceParams {
  email: string;
  password: string;
}

interface LoginAsAnUserServiceResponse {
  user: User;
}

export class LoginAsAnUserService {
  constructor(private usersRepository: UsersRepository) {}

  async execute({
    email,
    password,
  }: LoginAsAnUserServiceParams): Promise<LoginAsAnUserServiceResponse> {
    const user = await this.usersRepository.findByEmail(email)

    if (!user) {
      throw new InvalidCredentialsError()
    }

    const doesPasswordMatches = await compare(password, user.password_hash)

    if (!doesPasswordMatches) {
      throw new InvalidCredentialsError()
    }
  
    return {
      user,
    }
  }
}