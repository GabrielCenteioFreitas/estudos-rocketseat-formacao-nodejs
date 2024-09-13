import { FastifyInstance } from "fastify"
import { ZodError } from "zod"
import { env } from "../env"

type FastifyErrorHandler = FastifyInstance['errorHandler']

export const errorHandler: FastifyErrorHandler = (error, _, res) => {
  if (error instanceof ZodError) {
    return res.status(400).send({
      message: 'Validation error',
      issues: error.format()
    })
  }

  if (env.NODE_ENV !== 'prod') {
    console.error(error)
  }

  return res.status(500).send({ message: 'Internal server error' })
}