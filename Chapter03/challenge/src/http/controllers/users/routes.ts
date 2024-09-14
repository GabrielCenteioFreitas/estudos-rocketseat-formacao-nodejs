import { FastifyInstance } from "fastify";
import { loginRoute } from "./login";
import { registerRoute } from "./register";

export async function usersRoutes(app: FastifyInstance) {
  app.register(() => registerRoute(app, 'POST', '/users'))
  app.register(() => loginRoute(app, 'POST', '/users/sessions'))
}