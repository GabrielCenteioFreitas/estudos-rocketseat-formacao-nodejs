import { prisma } from '@/lib/prisma'
import { hash } from 'bcryptjs'
import { FastifyInstance } from 'fastify'
import request from 'supertest'

export async function registerAndLoginOrg(app: FastifyInstance) {
  await prisma.org.create({
    data: {
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
    }
  })

  const authResponse = await request(app.server)
    .post('/orgs/sessions')
    .send({
      email: 'org@example.com',
      password: '123456',
    })

  const { token } = authResponse.body

  return {
    token,
  }
}