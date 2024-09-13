import { app } from "@/app";
import { afterAll, beforeAll, describe, expect, it, test } from "vitest";
import request from "supertest"

describe('Login as an User (e2e)', () => {
  beforeAll(async () => {
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  it('should be able to login as an user', async () => {
    await request(app.server)
      .post('/users')
      .send({
        "name": "User",
        "email": "user@example.com",
        "password": "123456",
      })

    const response = await request(app.server)
      .post('/users/sessions')
      .send({
        email: 'user@example.com',
        password: '123456',
      })

    expect(response.statusCode).toEqual(200)
    expect(response.body).toEqual({
      token: expect.any(String)
    })
  })
})