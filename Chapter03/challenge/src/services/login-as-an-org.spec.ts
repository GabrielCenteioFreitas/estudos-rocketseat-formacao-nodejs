import { InMemoryOrgsRepository } from "@/repositories/in-memory/in-memory-orgs-repository";
import { OrgsRepository } from "@/repositories/orgs-repository";
import { hash } from "bcryptjs";
import { beforeEach, describe, expect, it } from "vitest";
import { InvalidCredentialsError } from "./errors/invalid-credentials-error";
import { LoginAsAnOrgService } from "./login-as-an-org";

let orgsRepository: OrgsRepository;
let sut: LoginAsAnOrgService;

describe('Login as an Org Service', () => {
  beforeEach(() => {
    orgsRepository = new InMemoryOrgsRepository()
    sut = new LoginAsAnOrgService(orgsRepository)
  })

  it('should be able to login as an org', async () => {
    await orgsRepository.create({
      name: 'Org',
      email: 'org@example.com',
      password_hash: await hash('123456', 6),
      author_name: 'Org Author',
      cep: '12345678',
      state: '',
      city: '',
      latitude: 0,
      longitude: 0,
      phone: '123456789',
    })

    const { org } = await sut.execute({
      email: 'org@example.com',
      password: '123456',
    })
    
    expect(org.id).toEqual(expect.any(String))
  })

  it('should not be able to login as an org with wrong email', async () => {
    await expect(() =>
      sut.execute({
        email: 'org@example.com',
        password: '123456',
      })
    ).rejects.toBeInstanceOf(InvalidCredentialsError)
  })

  it('should not be able to login as an org with wrong password', async () => {
    await orgsRepository.create({
      name: 'Org',
      email: 'org@example.com',
      password_hash: await hash('123456', 6),
      author_name: 'Org Author',
      cep: '12345678',
      state: '',
      city: '',
      latitude: 0,
      longitude: 0,
      phone: '123456789',
    })

    await expect(() =>
      sut.execute({
        email: 'org@example.com',
        password: '1234567',
      })
    ).rejects.toBeInstanceOf(InvalidCredentialsError)
  })
})