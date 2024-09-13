import { env } from "@/env";
import { FastifyJWTOptions } from "@fastify/jwt";

export const fastifyJwtConfig: FastifyJWTOptions = {
  secret: env.JWT_SECRET,
  cookie: {
    cookieName: 'refreshToken',
    signed: false,
  },
  sign: {
    expiresIn: '10m',
  }
}