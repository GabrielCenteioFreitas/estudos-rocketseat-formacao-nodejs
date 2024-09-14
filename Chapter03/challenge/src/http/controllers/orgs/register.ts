import { ZodFastifyRoute } from "@/@types/zod-fastify-route";
import { CepAlreadyInUseError } from "@/services/errors/cep-already-in-use";
import { EmailAlreadyInUseError } from "@/services/errors/email-already-in-use-error";
import { PhoneAlreadyInUseError } from "@/services/errors/phone-already-in-use-error";
import { makeRegisterOrgService } from "@/services/factories/make-register-org-service";
import z from "zod";

export const registerRoute: ZodFastifyRoute = async (app, method, path) => {
  app.route({
    method,
    url: path,
    schema: {
      summary: 'Register an Org',
      tags: ['Orgs'],
      body: z.object({
        name: z.string(),
        authorName: z.string(),
        cep: z.coerce.number(),
        email: z.string(),
        latitude: z.number(),
        longitude: z.number(),
        password: z.string(),
        phone: z.string(),
      })
    },
    handler: async (req, res) => {
      const { name, authorName, cep, email, latitude, longitude, password, phone } = req.body
  
      const registerOrgService = makeRegisterOrgService()
  
      try {
        await registerOrgService.execute({
          name,
          authorName,
          cep: cep.toString(),
          email,
          latitude,
          longitude,
          password,
          phone,
        })
  
        return res.status(201).send()
      } catch(error) {
        if (
          error instanceof CepAlreadyInUseError ||
          error instanceof EmailAlreadyInUseError ||
          error instanceof PhoneAlreadyInUseError
        ) {
          return res.status(409).send({ message: error.message })
        }
  
        throw error
      }
    }
  })
  // app.post('/orgs', {
  //   schema: {
  //     summary: 'Register an Org',
  //     tags: ['Orgs'],
  //     body: z.object({
  //       name: z.string(),
  //       authorName: z.string(),
  //       cep: z.coerce.number(),
  //       email: z.string(),
  //       latitude: z.number(),
  //       longitude: z.number(),
  //       password: z.string(),
  //       phone: z.string(),
  //     })
  //   }
  // }, async (req, res) => {
  //   const { name, authorName, cep, email, latitude, longitude, password, phone } = req.body

  //   const registerOrgService = makeRegisterOrgService()

  //   try {
  //     await registerOrgService.execute({
  //       name,
  //       authorName,
  //       cep: cep.toString(),
  //       email,
  //       latitude,
  //       longitude,
  //       password,
  //       phone,
  //     })

  //     return res.status(201).send()
  //   } catch(error) {
  //     if (
  //       error instanceof CepAlreadyInUseError ||
  //       error instanceof EmailAlreadyInUseError ||
  //       error instanceof PhoneAlreadyInUseError
  //     ) {
  //       return res.status(409).send({ message: error.message })
  //     }

  //     throw error
  //   }
  // })
}