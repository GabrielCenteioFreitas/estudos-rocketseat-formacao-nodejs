import { FastifyInstance } from "fastify";
import { loginRoute } from "./login";
import { registerRoute } from "./register";

export async function usersRoutes(app: FastifyInstance) {
  app.register(registerRoute) // POST "/users"
  app.register(loginRoute) // POST "/users/sessions"
}