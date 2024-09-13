import { app } from "@/app";
import { afterAll, beforeAll, describe, expect, it, test } from "vitest";
import request from "supertest"

describe('Refresh (e2e)', () => {
  beforeAll(async () => {
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  it('should be able to refresh a token', async () => {
    await request(app.server)
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

    const authResponse = await request(app.server)
      .post('/orgs/sessions')
      .send({
        email: 'org01@example.com',
        password: '123456',
      })

    const cookies = authResponse.get('Set-Cookie') || []

    const response = await request(app.server)
      .patch('/tokens/refresh')
      .set('Cookie', cookies)
      .send()

    expect(response.statusCode).toEqual(200)
    expect(response.body).toEqual({
      token: expect.any(String)
    })
    expect(response.get('Set-Cookie')).toEqual([
      expect.stringContaining('refreshToken=')
    ])
  })
})