import { FastifyInstance } from "fastify";
import { loginRoute } from "./login";
import { registerRoute } from "./register";

export const orgsRoutes = async (app: FastifyInstance) => {
  app.register(registerRoute) // POST "/orgs"
  app.register(loginRoute) // POST "/orgs/sessions"
}