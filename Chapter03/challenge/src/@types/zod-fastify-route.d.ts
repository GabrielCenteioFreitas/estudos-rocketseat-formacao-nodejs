import { FastifyBaseLogger, FastifyInstance, FastifySchema, FastifyTypeProviderDefault, HTTPMethods, RawServerDefault, RouteGenericInterface, RouteOptions, RouteShorthandOptions } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import { IncomingMessage, ServerResponse } from "http";

declare type ZodFastifyInstance = FastifyInstance<RawServerDefault, IncomingMessage, ServerResponse<IncomingMessage>, FastifyBaseLogger, ZodTypeProvider>

declare type ZodFastifyRoute = (
  app: ZodFastifyInstance,
  method: HTTPMethods,
  path: string,
) => Promise<void>