import { InMemoryOrgsRepository } from "@/repositories/in-memory/in-memory-orgs-repository";
import { InMemoryPetsRepository } from "@/repositories/in-memory/in-memory-pets-repository";
import { OrgsRepository } from "@/repositories/orgs-repository";
import { PetsRepository } from "@/repositories/pets-repository";
import { PetAge, PetEnergyLevel, PetEnvironment, PetIndependence, PetSize } from "@prisma/client";
import { hash } from "bcryptjs";
import { beforeEach, describe, expect, it } from "vitest";
import { ListPetsService } from "./list-pets";

let petsRepository: PetsRepository;
let orgsRepository: OrgsRepository;
let sut: ListPetsService;

describe('List Pets Service', () => {
  beforeEach(() => {
    orgsRepository = new InMemoryOrgsRepository()
    petsRepository = new InMemoryPetsRepository(orgsRepository)
    sut = new ListPetsService(petsRepository)
  })

  it('should be able to list pets by city', async () => {
    const org01 = await orgsRepository.create({
      name: 'Org 01',
      email: 'org01@example.com',
      password_hash: await hash('123456', 6),
      author_name: 'Org 01 Author',
      cep: '12345678',
      state: '',
      city: 'City 01',
      latitude: 0,
      longitude: 0,
      phone: '123456789',
    })

    const org02 = await orgsRepository.create({
      name: 'Org 02',
      email: 'org02@example.com',
      password_hash: await hash('123456', 6),
      author_name: 'Org 02 Author',
      cep: '12345678',
      state: '',
      city: 'City 02',
      latitude: 0,
      longitude: 0,
      phone: '123456789',
    })

    await petsRepository.create({
      org_id: org01.id,
      name: 'Pet 01',
      about: 'Pet 01 Description',
      age: PetAge.ADULT,
      energy_level: PetEnergyLevel.HIGH,
      environment: PetEnvironment.LARGE_SPACE,
      independence: PetIndependence.HIGH,
      size: PetSize.LARGE,
    })

    await petsRepository.create({
      org_id: org02.id,
      name: 'Pet 02',
      about: 'Pet 02 Description',
      age: PetAge.ADULT,
      energy_level: PetEnergyLevel.HIGH,
      environment: PetEnvironment.LARGE_SPACE,
      independence: PetIndependence.HIGH,
      size: PetSize.LARGE,
    })

    const { pets } = await sut.execute({
      city: 'City 01',
    })
    
    expect(pets).toHaveLength(1)
    expect(pets).toEqual([
      expect.objectContaining({ name: 'Pet 01' })
    ])
  })

  it('should be able to list pets by age', async () => {
    const org01 = await orgsRepository.create({
      name: 'Org 01',
      email: 'org01@example.com',
      password_hash: await hash('123456', 6),
      author_name: 'Org 01 Author',
      cep: '12345678',
      state: '',
      city: 'City 01',
      latitude: 0,
      longitude: 0,
      phone: '123456789',
    })

    const org02 = await orgsRepository.create({
      name: 'Org 02',
      email: 'org02@example.com',
      password_hash: await hash('123456', 6),
      author_name: 'Org 02 Author',
      cep: '12345678',
      state: '',
      city: 'City 02',
      latitude: 0,
      longitude: 0,
      phone: '123456789',
    })

    await petsRepository.create({
      org_id: org01.id,
      name: 'Pet 01',
      about: 'Pet 01 Description',
      age: PetAge.ADULT,
      energy_level: PetEnergyLevel.HIGH,
      environment: PetEnvironment.LARGE_SPACE,
      independence: PetIndependence.HIGH,
      size: PetSize.LARGE,
    })

    await petsRepository.create({
      org_id: org02.id,
      name: 'Pet 02',
      about: 'Pet 02 Description',
      age: PetAge.SENIOR,
      energy_level: PetEnergyLevel.MEDIUM,
      environment: PetEnvironment.SMALL_SPACE,
      independence: PetIndependence.MEDIUM,
      size: PetSize.SMALL,
    })

    const { pets } = await sut.execute({
      city: 'City 01',
      age: PetAge.ADULT
    })
    
    expect(pets).toHaveLength(1)
    expect(pets).toEqual([
      expect.objectContaining({ name: 'Pet 01' })
    ])
  })

  it('should be able to list pets by energy level', async () => {
    const org = await orgsRepository.create({
      name: 'Org 01',
      email: 'org01@example.com',
      password_hash: await hash('123456', 6),
      author_name: 'Org 01 Author',
      cep: '12345678',
      state: '',
      city: 'City 01',
      latitude: 0,
      longitude: 0,
      phone: '123456789',
    })

    await petsRepository.create({
      org_id: org.id,
      name: 'Pet 01',
      about: 'Pet 01 Description',
      age: PetAge.ADULT,
      energy_level: PetEnergyLevel.HIGH,
      environment: PetEnvironment.LARGE_SPACE,
      independence: PetIndependence.HIGH,
      size: PetSize.LARGE,
    })

    await petsRepository.create({
      org_id: org.id,
      name: 'Pet 02',
      about: 'Pet 02 Description',
      age: PetAge.SENIOR,
      energy_level: PetEnergyLevel.MEDIUM,
      environment: PetEnvironment.SMALL_SPACE,
      independence: PetIndependence.MEDIUM,
      size: PetSize.SMALL,
    })

    const { pets } = await sut.execute({
      city: 'City 01',
      energyLevel: PetEnergyLevel.HIGH
    })
    
    expect(pets).toHaveLength(1)
    expect(pets).toEqual([
      expect.objectContaining({ name: 'Pet 01' })
    ])
  })

  it('should be able to list pets by environment', async () => {
    const org = await orgsRepository.create({
      name: 'Org 01',
      email: 'org01@example.com',
      password_hash: await hash('123456', 6),
      author_name: 'Org 01 Author',
      cep: '12345678',
      state: '',
      city: 'City 01',
      latitude: 0,
      longitude: 0,
      phone: '123456789',
    })

    await petsRepository.create({
      org_id: org.id,
      name: 'Pet 01',
      about: 'Pet 01 Description',
      age: PetAge.ADULT,
      energy_level: PetEnergyLevel.HIGH,
      environment: PetEnvironment.LARGE_SPACE,
      independence: PetIndependence.HIGH,
      size: PetSize.LARGE,
    })

    await petsRepository.create({
      org_id: org.id,
      name: 'Pet 02',
      about: 'Pet 02 Description',
      age: PetAge.SENIOR,
      energy_level: PetEnergyLevel.MEDIUM,
      environment: PetEnvironment.SMALL_SPACE,
      independence: PetIndependence.MEDIUM,
      size: PetSize.SMALL,
    })

    const { pets } = await sut.execute({
      city: 'City 01',
      environment: PetEnvironment.LARGE_SPACE
    })
    
    expect(pets).toHaveLength(1)
    expect(pets).toEqual([
      expect.objectContaining({ name: 'Pet 01' })
    ])
  })

  it('should be able to list pets by independence', async () => {
    const org = await orgsRepository.create({
      name: 'Org 01',
      email: 'org01@example.com',
      password_hash: await hash('123456', 6),
      author_name: 'Org 01 Author',
      cep: '12345678',
      state: '',
      city: 'City 01',
      latitude: 0,
      longitude: 0,
      phone: '123456789',
    })

    await petsRepository.create({
      org_id: org.id,
      name: 'Pet 01',
      about: 'Pet 01 Description',
      age: PetAge.ADULT,
      energy_level: PetEnergyLevel.HIGH,
      environment: PetEnvironment.LARGE_SPACE,
      independence: PetIndependence.HIGH,
      size: PetSize.LARGE,
    })

    await petsRepository.create({
      org_id: org.id,
      name: 'Pet 02',
      about: 'Pet 02 Description',
      age: PetAge.SENIOR,
      energy_level: PetEnergyLevel.MEDIUM,
      environment: PetEnvironment.SMALL_SPACE,
      independence: PetIndependence.MEDIUM,
      size: PetSize.SMALL,
    })

    const { pets } = await sut.execute({
      city: 'City 01',
      independence: PetIndependence.HIGH
    })
    
    expect(pets).toHaveLength(1)
    expect(pets).toEqual([
      expect.objectContaining({ name: 'Pet 01' })
    ])
  })

  it('should be able to list pets by size', async () => {
    const org = await orgsRepository.create({
      name: 'Org 01',
      email: 'org01@example.com',
      password_hash: await hash('123456', 6),
      author_name: 'Org 01 Author',
      cep: '12345678',
      state: '',
      city: 'City 01',
      latitude: 0,
      longitude: 0,
      phone: '123456789',
    })

    await petsRepository.create({
      org_id: org.id,
      name: 'Pet 01',
      about: 'Pet 01 Description',
      age: PetAge.SENIOR,
      energy_level: PetEnergyLevel.MEDIUM,
      environment: PetEnvironment.SMALL_SPACE,
      independence: PetIndependence.MEDIUM,
      size: PetSize.LARGE,
    })

    await petsRepository.create({
      org_id: org.id,
      name: 'Pet 02',
      about: 'Pet 02 Description',
      age: PetAge.ADULT,
      energy_level: PetEnergyLevel.HIGH,
      environment: PetEnvironment.LARGE_SPACE,
      independence: PetIndependence.HIGH,
      size: PetSize.SMALL,
    })

    const { pets } = await sut.execute({
      city: 'City 01',
      size: PetSize.LARGE
    })
    
    expect(pets).toHaveLength(1)
    expect(pets).toEqual([
      expect.objectContaining({ name: 'Pet 01' })
    ])
  })

  it('should be able to list pets by age and size', async () => {
    const org = await orgsRepository.create({
      name: 'Org 01',
      email: 'org01@example.com',
      password_hash: await hash('123456', 6),
      author_name: 'Org 01 Author',
      cep: '12345678',
      state: '',
      city: 'City 01',
      latitude: 0,
      longitude: 0,
      phone: '123456789',
    })

    await petsRepository.create({
      org_id: org.id,
      name: 'Pet 01',
      about: 'Pet 01 Description',
      age: PetAge.SENIOR,
      energy_level: PetEnergyLevel.MEDIUM,
      environment: PetEnvironment.SMALL_SPACE,
      independence: PetIndependence.MEDIUM,
      size: PetSize.LARGE,
    })

    await petsRepository.create({
      org_id: org.id,
      name: 'Pet 02',
      about: 'Pet 02 Description',
      age: PetAge.ADULT,
      energy_level: PetEnergyLevel.HIGH,
      environment: PetEnvironment.LARGE_SPACE,
      independence: PetIndependence.HIGH,
      size: PetSize.LARGE,
    })

    await petsRepository.create({
      org_id: org.id,
      name: 'Pet 03',
      about: 'Pet 03 Description',
      age: PetAge.ADULT,
      energy_level: PetEnergyLevel.HIGH,
      environment: PetEnvironment.LARGE_SPACE,
      independence: PetIndependence.HIGH,
      size: PetSize.SMALL,
    })

    const { pets } = await sut.execute({
      city: 'City 01',
      age: PetAge.ADULT,
      size: PetSize.LARGE,
    })
    
    expect(pets).toHaveLength(1)
    expect(pets).toEqual([
      expect.objectContaining({ name: 'Pet 02' })
    ])
  })
})