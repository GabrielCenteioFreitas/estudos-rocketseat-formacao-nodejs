import { InMemoryUsersRepository } from "@/repositories/in-memory/in-memory-users-repository";
import { UsersRepository } from "@/repositories/users-repository";
import { hash } from "bcryptjs";
import { beforeEach, describe, expect, it } from "vitest";
import { InvalidCredentialsError } from "./errors/invalid-credentials-error";
import { LoginAsAnUserService } from "./login-as-an-user";

let usersRepository: UsersRepository;
let sut: LoginAsAnUserService;

describe('Login as an User Service', () => {
  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository()
    sut = new LoginAsAnUserService(usersRepository)
  })

  it('should be able to login as an user', async () => {
    await usersRepository.create({
      name: 'User',
      email: 'user@example.com',
      password_hash: await hash('123456', 6),
    })

    const { user } = await sut.execute({
      email: 'user@example.com',
      password: '123456',
    })
    
    expect(user.id).toEqual(expect.any(String))
  })

  it('should not be able to login as an user with wrong email', async () => {
    await expect(() =>
      sut.execute({
        email: 'user@example.com',
        password: '123456',
      })
    ).rejects.toBeInstanceOf(InvalidCredentialsError)
  })

  it('should not be able to login as an user with wrong password', async () => {
    await usersRepository.create({
      name: 'User',
      email: 'user@example.com',
      password_hash: await hash('123456', 6),
    })

    await expect(() =>
      sut.execute({
        email: 'user@example.com',
        password: '1234567',
      })
    ).rejects.toBeInstanceOf(InvalidCredentialsError)
  })
})