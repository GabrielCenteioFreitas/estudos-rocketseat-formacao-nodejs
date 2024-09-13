import { app } from "@/app";
import { prisma } from "@/lib/prisma";
import { PetAge, PetEnergyLevel, PetEnvironment, PetIndependence, PetSize } from "@prisma/client";
import { hash } from "bcryptjs";
import request from "supertest";
import { afterAll, beforeAll, describe, expect, it } from "vitest";

describe("List Pets (e2e)", () => {
  beforeAll(async () => {
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  it("should be able to get pets by city and age", async () => {
    await prisma.org.createMany({
      data: [
        {
          name: 'Org 01',
          email: 'org01@example.com',
          password_hash: await hash('123456', 6),
          author_name: 'Org Author',
          cep: '01',
          state: '',
          city: 'City01',
          latitude: 0,
          longitude: 0,
          phone: '01',
        },
        {
          name: 'Org 02',
          email: 'org02@example.com',
          password_hash: await hash('123456', 6),
          author_name: 'Org 02 Author',
          cep: '02',
          state: '',
          city: 'City02',
          latitude: 0,
          longitude: 0,
          phone: '02',
        },
      ]
    })

    const loginResponse01 = await request(app.server)
      .post('/orgs/sessions')
      .send({
        email: 'org01@example.com',
        password: '123456',
      })

    const loginResponse02 = await request(app.server)
      .post('/orgs/sessions')
      .send({
        email: 'org02@example.com',
        password: '123456',
      })

    const { token: token01 } = loginResponse01.body
    const { token: token02 } = loginResponse02.body

    await request(app.server)
      .post("/pets")
      .set("Authorization", `Bearer ${token01}`)
      .send({
        name: "Pet 01",
        about: "Pet Description 01",
        age: PetAge.ADULT,
        energyLevel: PetEnergyLevel.HIGH,
        environment: PetEnvironment.LARGE_SPACE,
        independence: PetIndependence.HIGH,
        size: PetSize.LARGE,
      })

    await request(app.server)
      .post("/pets")
      .set("Authorization", `Bearer ${token01}`)
      .send({
        name: "Pet 02",
        about: "Pet Description 02",
        age: PetAge.SENIOR,
        energyLevel: PetEnergyLevel.HIGH,
        environment: PetEnvironment.LARGE_SPACE,
        independence: PetIndependence.HIGH,
        size: PetSize.LARGE,
      })

    await request(app.server)
      .post("/pets")
      .set("Authorization", `Bearer ${token02}`)
      .send({
        name: "Pet 03",
        about: "Pet Description 03",
        age: PetAge.ADULT,
        energyLevel: PetEnergyLevel.HIGH,
        environment: PetEnvironment.LARGE_SPACE,
        independence: PetIndependence.HIGH,
        size: PetSize.LARGE,
      })

    const getPetsByCityResponse = await request(app.server)
      .get(`/pets?city=City01&age=ADULT`)
      .set("Authorization", `Bearer ${token01}`)
      .send()

    expect(getPetsByCityResponse.statusCode).toEqual(200)
    expect(getPetsByCityResponse.body.pets).toHaveLength(1)
    expect(getPetsByCityResponse.body.pets).toEqual([
      expect.objectContaining({ name: 'Pet 01' })
    ])
  })
})