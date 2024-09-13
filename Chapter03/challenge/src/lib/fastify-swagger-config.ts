import { SwaggerOptions } from "@fastify/swagger";
import { jsonSchemaTransform } from "fastify-type-provider-zod";

export const fastifySwaggerConfig: SwaggerOptions = {
  swagger: {
    consumes: ['application/json'],
    produces: ['application/json'],
    info: {
      title: 'Rocketseat - NodeJS - Chapter 03 Challenge',
      description: 'Documentação da API construída para o desafio do Capítulo 3 do curso de NodeJS da Rocketseat',
      version: '1.0.0'
    },
  },
  transform: jsonSchemaTransform,
}