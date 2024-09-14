import { ZodFastifyRoute } from "@/@types/zod-fastify-route";
import { ResourceNotFoundError } from "@/services/errors/resource-not-found-error";
import { makeGetPetDetailsService } from "@/services/factories/make-get-pet-details-service";
import z from "zod";

export const detailsRoute: ZodFastifyRoute = async (app, method, path) => {
  app.route({
    method,
    url: path,
    schema: {
      summary: 'Get pet details',
      tags: ['Pets'],
      params: z.object({
        petId: z.string(),
      })
    },
    handler: async (req, res) => {
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
    }
  })
}