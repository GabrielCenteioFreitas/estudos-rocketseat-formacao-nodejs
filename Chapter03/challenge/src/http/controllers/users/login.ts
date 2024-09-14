import { ZodFastifyRoute } from "@/@types/zod-fastify-route";
import { InvalidCredentialsError } from "@/services/errors/invalid-credentials-error";
import { makeLoginAsAnUserService } from "@/services/factories/make-login-as-an-user-service";
import z from "zod";

export const loginRoute: ZodFastifyRoute = async (app, method, path) => {
  app.route({
    method,
    url: path,
    schema: {
      summary: 'Login as an User',
      tags: ['Users'],
      body: z.object({
        email: z.string(),
        password: z.string(),
      })
    },
    handler: async (req, res) => {
      const { email, password } = req.body

      const loginAsAnUserService = makeLoginAsAnUserService()

      try {
        const { user } = await loginAsAnUserService.execute({
          email,
          password,
        })

        const token = await res.jwtSign(
          {
            role: user.role,
          },
          {
            sign: {
              sub: user.id,
            }
          }
        )

        const refreshToken = await res.jwtSign(
          {
            role: user.role,
          },
          {
            sign: {
              sub: user.id,
              expiresIn: '7d',
            }
          }
        )

        return res
          .setCookie('refreshToken', refreshToken, {
            path: '/',
            secure: true,
            sameSite: true,
            httpOnly: true,
          })
          .status(200)
          .send({
            token,
          })
      } catch(error) {
        if (error instanceof InvalidCredentialsError) {
          return res.status(409).send({ message: error.message })
        }

        throw error
      }
    }
  })
}