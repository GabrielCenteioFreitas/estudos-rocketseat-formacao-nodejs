import { app } from "@/app";
import { prisma } from "@/lib/prisma";
import { fakeLatitude, fakeLongitude } from "@/use-cases/check-in.spec";
import { createAndAuthenticateUser } from "@/utils/test/create-and-authenticate-user";
import request from "supertest";
import { afterAll, beforeAll, describe, expect, it } from "vitest";

describe('Create Check-in (e2e)', () => {
  beforeAll(async () => {
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  it('should be able to create a check-in', async () => {
    const { token } = await createAndAuthenticateUser(app)

    const gym = await prisma.gym.create({
      data: {
        title: 'Gym 01',
        description: 'Gym 01 Description',
        phone: '123456789',
        latitude: fakeLatitude,
        longitude: fakeLongitude,
      }
    })

    const response = await request(app.server)
      .post(`/gyms/${gym.id}/check-ins`)
      .set('Authorization', `Bearer ${token}`)
      .send({
        latitude: fakeLatitude,
        longitude: fakeLongitude,
      })

    expect(response.statusCode).toEqual(201)
  })
})