import { ZodFastifyRoute } from "@/@types/zod-fastify-route";
import { makeListPetsService } from "@/services/factories/make-list-pets-service";
import { PetAge, PetEnergyLevel, PetEnvironment, PetIndependence, PetSize } from "@prisma/client";
import z from "zod";

export const listRoute: ZodFastifyRoute = async (app, method, path) => {
  app.route({
    method,
    url: path,
    schema: {
      summary: 'List pets by its characteristics',
      tags: ['Pets'],
      querystring: z.object({
        city: z.string(),
        age: z.nativeEnum(PetAge).optional(),
        size: z.nativeEnum(PetSize).optional(),
        energyLevel: z.nativeEnum(PetEnergyLevel).optional(),
        independence: z.nativeEnum(PetIndependence).optional(),
        environment: z.nativeEnum(PetEnvironment).optional(),
      })
    },
    handler: async (req, res) => {
      const {
        city,
        age,
        size,
        energyLevel,
        independence,
        environment,
      } = req.query

      const listPetsService = makeListPetsService()

      const { pets } = await listPetsService.execute({
        city,
        age,
        size,
        energyLevel,
        independence,
        environment,
      })

      return res.status(200).send({
        pets,
      })
    }
  })
}