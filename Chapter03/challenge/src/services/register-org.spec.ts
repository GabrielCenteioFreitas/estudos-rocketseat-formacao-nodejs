import { InMemoryOrgsRepository } from "@/repositories/in-memory/in-memory-orgs-repository";
import { OrgsRepository } from "@/repositories/orgs-repository";
import { beforeEach, describe, expect, it } from "vitest";
import { RegisterOrgService } from "./register-org";
import { EmailAlreadyInUseError } from "./errors/email-already-in-use-error";
import { PhoneAlreadyInUseError } from "./errors/phone-already-in-use-error";
import { CepAlreadyInUseError } from "./errors/cep-already-in-use";

let orgsRepository: OrgsRepository;
let sut: RegisterOrgService;

describe('Register Org Service', () => {
  beforeEach(() => {
    orgsRepository = new InMemoryOrgsRepository()
    sut = new RegisterOrgService(orgsRepository)
  })

  it('should be able to register an org', async () => {
    const { org } = await sut.execute({
      name: 'Org',
      email: 'org@example.com',
      password: '123456',
      authorName: 'Org Author',
      cep: '12345678',
      latitude: 0,
      longitude: 0,
      phone: '123456789',
    })
    
    expect(org.id).toEqual(expect.any(String))
  })

  it('should not be able to register an org with same cep twice', async () => {
    const cep = '12345678'

    await sut.execute({
      name: 'Org 01',
      email: 'org01@example.com',
      password: '123456',
      authorName: 'Org 01 Author',
      cep,
      latitude: 0,
      longitude: 0,
      phone: '123456789',
    })

    await expect(() =>
      sut.execute({
        name: 'Org 02',
        email: 'org02@example.com',
        password: '123456',
        authorName: 'Org 02 Author',
        cep: '12345678',
        latitude: 0,
        longitude: 0,
        phone: '987654321',
      })
    ).rejects.toBeInstanceOf(CepAlreadyInUseError)
  })

  it('should not be able to register an org with same email twice', async () => {
    const email = 'org@example.com'

    await sut.execute({
      name: 'Org 01',
      email,
      password: '123456',
      authorName: 'Org 01 Author',
      cep: '12345678',
      latitude: 0,
      longitude: 0,
      phone: '123456789'
    })

    await expect(() =>
      sut.execute({
        name: 'Org 02',
        email,
        password: '123456',
        authorName: 'Org 02 Author',
        cep: '23456789',
        latitude: 0,
        longitude: 0,
        phone: '987654321'
      })
    ).rejects.toBeInstanceOf(EmailAlreadyInUseError)
  })

  it('should not be able to register an org with same phone twice', async () => {
    const phone = '123456789'

    await sut.execute({
      name: 'Org 01',
      email: 'org01@example.com',
      password: '123456',
      authorName: 'Org 01 Author',
      cep: '12345678',
      latitude: 0,
      longitude: 0,
      phone,
    })

    await expect(() =>
      sut.execute({
        name: 'Org 02',
        email: 'org02@example.com',
        password: '123456',
        authorName: 'Org 02 Author',
        cep: '23456789',
        latitude: 0,
        longitude: 0,
        phone,
      })
    ).rejects.toBeInstanceOf(PhoneAlreadyInUseError)
  })
})