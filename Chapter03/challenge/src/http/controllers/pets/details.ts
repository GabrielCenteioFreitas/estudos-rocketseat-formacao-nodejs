import { ResourceNotFoundError } from "@/services/errors/resource-not-found-error";
import { makeGetPetDetailsService } from "@/services/factories/make-get-pet-details-service";
import { FastifyPluginAsyncZod } from "fastify-type-provider-zod";
import z from "zod";

export const detailsRoute: FastifyPluginAsyncZod = async (app) => {
  app.get('/pets/:petId', {
    schema: {
      summary: 'Get pet details',
      tags: ['Pets'],
      params: z.object({
        petId: z.string(),
      })
    }
  }, async (req, res) => {
    const { petId } = req.params

    const getPetDetailsService = makeGetPetDetailsService()

    try {
      const { pet } = await getPetDetailsService.execute({
        petId,
      })

      return res.status(200).send({
        pet,
      })
    } catch(error) {
      if (error instanceof ResourceNotFoundError) {
        return res.status(404).send({ message: error.message })
      }

      throw error
    }
  })
}