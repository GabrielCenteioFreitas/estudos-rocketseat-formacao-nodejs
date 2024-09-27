import { InvalidCredentialsError } from "@/core/errors/use-cases/invalid-credentials-error";
import { AuthenticateDeliveryManUseCase } from "@/domain/delivery/application/use-cases/authenticate-delivery-man";
import { Public } from "@/infra/auth/public";
import { BadRequestException, Body, Controller, HttpCode, Post } from "@nestjs/common";
import { z } from "zod";
import { ZodValidationPipe } from "../pipes/zod-validation-pipe";

const authenticateDeliveryManBodySchema = z.object({
  cpf: z.string().length(11),
  password: z.string().min(6),
})

const bodyValidationPipe = new ZodValidationPipe(authenticateDeliveryManBodySchema)

type AuthenticateDeliveryManBodySchema = z.infer<typeof authenticateDeliveryManBodySchema>

@Controller('/sessions/delivery-man')
@Public()
export class AuthenticateDeliveryManController {
  constructor(
    private authenticateDeliveryMan: AuthenticateDeliveryManUseCase
  ) {}

  @Post()
  @HttpCode(200)
  async handle(
    @Body(bodyValidationPipe) body: AuthenticateDeliveryManBodySchema
  ) {
    const { cpf, password } = body

    const result = await this.authenticateDeliveryMan.execute({
      cpf,
      password,
    })

    if (result.isLeft()) {
      const error = result.value

      switch(error.constructor) {
        case InvalidCredentialsError:
          throw new BadRequestException(error.message)
        default:
          throw new BadRequestException(error.message)
      }
    }

    const { token } = result.value

    return {
      token,
    }
  }
}