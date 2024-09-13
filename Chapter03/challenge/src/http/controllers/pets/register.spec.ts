import { app } from "@/app";
import { registerAndLoginOrg } from "@/utils/tests/register-and-login-org";
import { PetAge, PetEnergyLevel, PetEnvironment, PetIndependence, PetSize } from "@prisma/client";
import request from "supertest";
import { afterAll, beforeAll, describe, expect, it } from "vitest";

describe('Register Pet (e2e)', () => {
  beforeAll(async () => {
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  it('should be able to register a pet', async () => {
    const { token } = await registerAndLoginOrg(app)

    const response = await request(app.server)
      .post("/pets")
      .set('Authorization', `Bearer ${token}`)
      .send({
        name: "Pet",
        about: 'Pet Description',
        age: PetAge.ADULT,
        energyLevel: PetEnergyLevel.HIGH,
        environment: PetEnvironment.LARGE_SPACE,
        independence: PetIndependence.HIGH,
        size: PetSize.LARGE,
      })

    expect(response.statusCode).toEqual(201)
  })
})