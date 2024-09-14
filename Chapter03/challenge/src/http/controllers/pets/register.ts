import { ZodFastifyRoute } from "@/@types/zod-fastify-route";
import { verifyRole } from "@/http/middlewares/verify-role";
import { ResourceNotFoundError } from "@/services/errors/resource-not-found-error";
import { makeRegisterPetService } from "@/services/factories/make-register-pet-service";
import { PetAge, PetEnergyLevel, PetEnvironment, PetIndependence, PetSize } from "@prisma/client";
import z from "zod";

export const registerRoute: ZodFastifyRoute = async (app, method, path) => {
  app.route({
    method,
    url: path,
    onRequest: [ verifyRole('ADMIN') ],
    schema: {
      summary: 'Register a pet',
      tags: ['Pets'],
      body: z.object({
        name: z.string(),
        about: z.string(),
        age: z.nativeEnum(PetAge),
        size: z.nativeEnum(PetSize),
        energyLevel: z.nativeEnum(PetEnergyLevel),
        independence: z.nativeEnum(PetIndependence),
        environment: z.nativeEnum(PetEnvironment),
        photos: z.array(z.string()).optional(),
        requirements: z.array(z.string()).optional(),
      }),
    },
    handler: async (req, res) => {
      const pet = req.body

      const registerPetService = makeRegisterPetService()

      const org = req.user

      try {
        await registerPetService.execute({
          orgId: org.sub,
          pet,
        })

        return res.status(201).send()
      } catch(error) {
        if (error instanceof ResourceNotFoundError) {
          return res.status(404).send({ message: error.message })
        }

        throw error
      }
    },
  })
}