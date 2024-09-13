import { app } from "@/app";
import { prisma } from "@/lib/prisma";
import { registerAndLoginOrg } from "@/utils/tests/register-and-login-org";
import { PetAge, PetEnergyLevel, PetEnvironment, PetIndependence, PetSize } from "@prisma/client";
import request from "supertest";
import { afterAll, beforeAll, describe, expect, it } from "vitest";

describe("Get Pet Details (e2e)", () => {
  beforeAll(async () => {
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  it("should be able to get pet details", async () => {
    const { token } = await registerAndLoginOrg(app)

    await request(app.server)
      .post("/pets")
      .set("Authorization", `Bearer ${token}`)
      .send({
        name: "Pet",
        about: "Pet Description",
        age: PetAge.ADULT,
        energyLevel: PetEnergyLevel.HIGH,
        environment: PetEnvironment.LARGE_SPACE,
        independence: PetIndependence.HIGH,
        size: PetSize.LARGE,
      })

    const pet = await prisma.pet.findFirst({
      where : {
        name: "Pet"
      }
    })

    const getPetDetailsResponse = await request(app.server)
      .get(`/pets/${pet?.id}`)
      .set("Authorization", `Bearer ${token}`)
      .send()

    expect(getPetDetailsResponse.statusCode).toEqual(200)
    expect(getPetDetailsResponse.body.pet).toEqual(
      expect.objectContaining({
        name: "Pet",
        about: "Pet Description",
      })
    )
  })
})