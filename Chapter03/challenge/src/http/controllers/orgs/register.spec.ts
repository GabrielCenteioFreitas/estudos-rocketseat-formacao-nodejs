import { app } from "@/app";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import request from "supertest"

describe('Register an Org (e2e)', () => {
  beforeAll(async () => {
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  it('should be able to register an org', async () => {
    const response = await request(app.server)
      .post('/orgs')
      .send({
        "name": "Org 01",
        "authorName": "Org 01 Author",
        "cep": "12345678",
        "email": "org01@example.com",
        "latitude": 0,
        "longitude": 0,
        "password": "123456",
        "phone": "123456789",
      })

    expect(response.statusCode).toEqual(201)
  })
})