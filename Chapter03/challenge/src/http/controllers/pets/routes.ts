import { verifyJWT } from "@/http/middlewares/verify-jwt";
import { FastifyInstance } from "fastify";
import { detailsRoute } from "./details";
import { listRoute } from "./list";
import { registerRoute } from "./register";

export async function petsRoutes(app: FastifyInstance) {
  app.addHook('onRequest', verifyJWT)

  app.register(() => registerRoute(app, 'POST', '/pets'))

  app.register(() => listRoute(app, 'GET', '/pets'))
  app.register(() => detailsRoute(app, 'GET', '/pets/:petId'))
}