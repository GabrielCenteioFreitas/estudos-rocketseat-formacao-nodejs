import { FastifyInstance } from "fastify";
import { refreshRoute } from "./refresh";

export async function tokensRoutes(app: FastifyInstance) {
  app.register(() => refreshRoute(app, 'PATCH', '/tokens/refresh'))
}