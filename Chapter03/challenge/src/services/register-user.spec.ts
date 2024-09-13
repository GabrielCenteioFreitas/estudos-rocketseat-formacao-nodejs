import { InMemoryUsersRepository } from "@/repositories/in-memory/in-memory-users-repository";
import { UsersRepository } from "@/repositories/users-repository";
import { beforeEach, describe, expect, it } from "vitest";
import { EmailAlreadyInUseError } from "./errors/email-already-in-use-error";
import { RegisterUserService } from "./register-user";

let usersRepository: UsersRepository;
let sut: RegisterUserService;

describe('Register User Service', () => {
  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository()
    sut = new RegisterUserService(usersRepository)
  })

  it('should be able to register an user', async () => {
    const { user } = await sut.execute({
      name: 'User 01',
      email: 'user01@example.com',
      password: '123456',
    })
    
    expect(user.id).toEqual(expect.any(String))
  })

  it('should not be able to register an org with same email twice', async () => {
    const email = 'user@example.com'

    await sut.execute({
      name: 'User 01',
      email,
      password: '123456',
    })

    await expect(() =>
      sut.execute({
        name: 'User 02',
        email,
        password: '123456',
      })
    ).rejects.toBeInstanceOf(EmailAlreadyInUseError)
  })
})