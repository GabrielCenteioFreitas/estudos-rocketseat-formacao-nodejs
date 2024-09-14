import { ZodFastifyRoute } from "@/@types/zod-fastify-route"

export const refreshRoute: ZodFastifyRoute = async (app, method, path) => {
  app.route({
    method,
    url: path,
    schema: {
      summary: 'Refresh a JWT',
      tags: ['Tokens'],
    },
    handler: async (req, res) => {
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
    }
  })
}