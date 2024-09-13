import fastifyCookie from "@fastify/cookie";
import fastifyJwt from "@fastify/jwt";
import fastifySwagger from "@fastify/swagger";
import fastifySwaggerUi from "@fastify/swagger-ui";
import fastify from "fastify";
import { serializerCompiler, validatorCompiler } from "fastify-type-provider-zod";
import { orgsRoutes } from "./http/controllers/orgs/routes";
import { petsRoutes } from "./http/controllers/pets/routes";
import { tokensRoutes } from "./http/controllers/tokens/routes";
import { usersRoutes } from "./http/controllers/users/routes";
import { errorHandler } from "./lib/error-handler";
import { fastifyJwtConfig } from "./lib/fastify-jwt-config";
import { fastifySwaggerConfig } from "./lib/fastify-swagger-config";
import { fastifySwaggerUiConfig } from "./lib/fastify-swagger-ui-config";

export const app = fastify()

// Fastify Type Provider Zod
app.setValidatorCompiler(validatorCompiler)
app.setSerializerCompiler(serializerCompiler)

// Error Handler
app.setErrorHandler(errorHandler)

// Fastify Swagger
app.register(fastifySwagger, fastifySwaggerConfig)
app.register(fastifySwaggerUi, fastifySwaggerUiConfig)

// Fastify JWT
app.register(fastifyJwt, fastifyJwtConfig)

// Fastify Cookies
app.register(fastifyCookie)

// Routes
app.register(orgsRoutes)
app.register(usersRoutes)
app.register(petsRoutes)
app.register(tokensRoutes)