import { InvalidCredentialsError } from "@/core/errors/use-cases/invalid-credentials-error";
import { AuthenticateRecipientUseCase } from "@/domain/delivery/application/use-cases/authenticate-recipient";
import { Public } from "@/infra/auth/public";
import { BadRequestException, Body, Controller, HttpCode, Post } from "@nestjs/common";
import { z } from "zod";
import { ZodValidationPipe } from "../pipes/zod-validation-pipe";
import { ApiOperation, ApiTags } from "@nestjs/swagger";

const authenticateRecipientBodySchema = z.object({
  cpf: z.string().length(11),
  password: z.string().min(6),
})

const bodyValidationPipe = new ZodValidationPipe(authenticateRecipientBodySchema)

type AuthenticateRecipientBodySchema = z.infer<typeof authenticateRecipientBodySchema>

@ApiTags('Recipients')
@Controller('/sessions/recipient')
@Public()
export class AuthenticateRecipientController {
  constructor(
    private authenticateRecipient: AuthenticateRecipientUseCase
  ) {}

  @Post()
  @HttpCode(200)
  @ApiOperation({ summary: 'Authenticate Recipient' })
  async handle(
    @Body(bodyValidationPipe) body: AuthenticateRecipientBodySchema
  ) {
    const { cpf, password } = body

    const result = await this.authenticateRecipient.execute({
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