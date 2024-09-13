import { FastifyPluginAsyncZod } from "fastify-type-provider-zod"

export const refreshRoute: FastifyPluginAsyncZod = async (app) => {
  app.patch('/tokens/refresh', {
    schema: {
      summary: 'Refresh a JWT',
      tags: ['Tokens'],
    }
  }, async (req, res) => {
    await req.jwtVerify({ onlyCookie: true })

    const { sub, role } = req.user

    const token = await res.jwtSign(
      {
        role,
      },
      {
        sign: {
          sub,
        },
      },
    )

    const refreshToken = await res.jwtSign(
      {
        role,
      },
      {
        sign: {
          sub,
          expiresIn: '7d',
        },
      },
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
  })
}