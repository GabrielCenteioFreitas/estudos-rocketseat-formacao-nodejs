import { InvalidCredentialsError } from "@/core/errors/use-cases/invalid-credentials-error";
import { AuthenticateAdminUseCase } from "@/domain/delivery/application/use-cases/authenticate-admin";
import { Public } from "@/infra/auth/public";
import { BadRequestException, Body, Controller, HttpCode, Post } from "@nestjs/common";
import { z } from "zod";
import { ZodValidationPipe } from "../pipes/zod-validation-pipe";
import { ApiOperation, ApiTags } from "@nestjs/swagger";

const authenticateAdminBodySchema = z.object({
  cpf: z.string().length(11),
  password: z.string().min(6),
})

const bodyValidationPipe = new ZodValidationPipe(authenticateAdminBodySchema)

type AuthenticateAdminBodySchema = z.infer<typeof authenticateAdminBodySchema>

@ApiTags('Admins')
@Controller('/sessions/admin')
@Public()
export class AuthenticateAdminController {
  constructor(
    private authenticateAdmin: AuthenticateAdminUseCase
  ) {}

  @Post()
  @HttpCode(200)
  @ApiOperation({ summary: 'Authenticate Admin' })
  async handle(
    @Body(bodyValidationPipe) body: AuthenticateAdminBodySchema
  ) {
    const { cpf, password } = body

    const result = await this.authenticateAdmin.execute({
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