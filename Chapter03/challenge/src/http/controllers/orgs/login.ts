import { InvalidCredentialsError } from "@/services/errors/invalid-credentials-error";
import { makeLoginAsAnOrgService } from "@/services/factories/make-login-as-an-org-service";
import { FastifyPluginAsyncZod } from "fastify-type-provider-zod";
import z from "zod";

export const loginRoute: FastifyPluginAsyncZod = async (app) => {
  app.post('/orgs/sessions', {
    schema: {
      summary: 'Login as an Org',
      tags: ['Orgs'],
      body: z.object({
        email: z.string(),
        password: z.string(),
      })
    }
  }, async (req, res) => {
    const { email, password } = req.body

    const loginAsAnOrgService = makeLoginAsAnOrgService()

    try {
      const { org } = await loginAsAnOrgService.execute({
        email,
        password,
      })

      const token = await res.jwtSign(
        {
          role: org.role,
        },
        {
          sign: {
            sub: org.id,
          }
        }
      )

      const refreshToken = await res.jwtSign(
        {
          role: org.role,
        },
        {
          sign: {
            sub: org.id,
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
  })
}