import { verifyJWT } from "@/http/middlewares/verify-jwt";
import { FastifyInstance } from "fastify";
import { detailsRoute } from "./details";
import { listRoute } from "./list";
import { registerRoute } from "./register";

export async function petsRoutes(app: FastifyInstance) {
  app.addHook('onRequest', verifyJWT)

  app.register(registerRoute) // POST "/pets"

  app.register(listRoute) // GET "/pets/:petId"
  app.register(detailsRoute) // GET "/pets"
}