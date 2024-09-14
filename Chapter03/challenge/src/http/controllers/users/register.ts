import { ZodFastifyRoute } from "@/@types/zod-fastify-route";
import { EmailAlreadyInUseError } from "@/services/errors/email-already-in-use-error";
import { makeRegisterUserService } from "@/services/factories/make-register-user-service";
import z from "zod";

export const registerRoute: ZodFastifyRoute = async (app, method, path) => {
  app.route({
    method,
    url: path,
    schema: {
      summary: 'Register an User',
      tags: ['Users'],
      body: z.object({
        name: z.string(),
        email: z.string(),
        password: z.string(),
      })
    },
    handler: async (req, res) => {
      const { name, email, password } = req.body
      
      const registerUserService = makeRegisterUserService()
      
      try {
        await registerUserService.execute({
          name,
          email,
          password,
        })
        
        return res.status(201).send()
      } catch(error) {
        if (error instanceof EmailAlreadyInUseError) {
          return res.status(409).send({ message: error.message })
        }
        
        throw error
      }
    }
  })
}