import { UsersRepository } from "@/repositories/users-repository";
import { User } from "@prisma/client";
import { hash } from 'bcryptjs';
import { EmailAlreadyInUseError } from "./errors/email-already-in-use-error";

interface RegisterUserServiceParams {
  name: string;
  email: string;
  password: string;
}

interface RegisterUserServiceReturn {
  user: User;
}

export class RegisterUserService {
  constructor(private usersRepository: UsersRepository) {}

  async execute({
    name,
    email,
    password,
  }: RegisterUserServiceParams): Promise<RegisterUserServiceReturn> {
    const emailAlreadyInUse = await this.usersRepository.findByEmail(email)

    if (emailAlreadyInUse) {
      throw new EmailAlreadyInUseError()
    }

    const password_hash = await hash(password, 6)

    const user = await this.usersRepository.create({
      name,
      email,
      password_hash,
    })

    return {
      user,
    }
  }
}

