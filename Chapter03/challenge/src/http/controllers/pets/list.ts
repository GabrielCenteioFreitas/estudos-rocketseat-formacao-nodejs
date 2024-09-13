import { makeListPetsService } from "@/services/factories/make-list-pets-service";
import { PetAge, PetEnergyLevel, PetEnvironment, PetIndependence, PetSize } from "@prisma/client";
import { FastifyPluginAsyncZod } from "fastify-type-provider-zod";
import z from "zod";

export const listRoute: FastifyPluginAsyncZod = async (app) => {
  app.get('/pets', {
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
    }
  }, async (req, res) => {
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
  })
}