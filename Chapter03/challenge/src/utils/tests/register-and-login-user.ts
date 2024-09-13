import { prisma } from '@/lib/prisma'
import { hash } from 'bcryptjs'
import { FastifyInstance } from 'fastify'
import request from 'supertest'

export async function registerAndLoginUser(app: FastifyInstance) {
  await prisma.user.create({
    data: {
      name: 'User',
      email: 'user@example.com',
      password_hash: await hash('123456', 6),
    }
  })

  const authResponse = await request(app.server)
    .post('/users/sessions')
    .send({
      email: 'user@example.com',
      password: '123456',
    })

  const { token } = authResponse.body

  return {
    token,
  }
}