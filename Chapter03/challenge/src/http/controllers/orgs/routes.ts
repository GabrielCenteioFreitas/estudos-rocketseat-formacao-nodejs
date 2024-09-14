import { FastifyInstance } from "fastify";
import { A, loginRoute } from "./login";
import { registerRoute } from "./register";


export const orgsRoutes = async (app: FastifyInstance) => {
  app.register(() => registerRoute(app, 'POST', '/orgs'))
  app.register(() => loginRoute(app, 'POST', '/orgs/sessions'))
}