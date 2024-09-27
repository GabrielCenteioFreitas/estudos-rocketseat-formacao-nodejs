import { CpfAlreadyInUseError } from "@/core/errors/use-cases/cpf-already-in-use-error";
import { RegisterAdminUseCase } from "@/domain/delivery/application/use-cases/register-admin";
import { Public } from "@/infra/auth/public";
import { BadRequestException, Body, ConflictException, Controller, HttpCode, Post } from "@nestjs/common";
import { ApiOperation, ApiTags } from "@nestjs/swagger";
import { z } from "zod";
import { ZodValidationPipe } from "../pipes/zod-validation-pipe";

const registerAdminBodySchema = z.object({
  name: z.string().min(1),
  cpf: z.string().length(11),
  password: z.string().min(6),
})

const bodyValidationPipe = new ZodValidationPipe(registerAdminBodySchema)

type RegisterAdminBodySchema = z.infer<typeof registerAdminBodySchema>

@ApiTags('Admins')
@Controller('/register/admin')
@Public()
export class RegisterAdminController {
  constructor(
    private registerAdmin: RegisterAdminUseCase
  ) {}

  @Post()
  @HttpCode(201)
  @ApiOperation({ summary: 'Register Admin' })
  async handle(
    @Body(bodyValidationPipe) body: RegisterAdminBodySchema
  ) {
    const { cpf, name, password } = body

    const result = await this.registerAdmin.execute({
      name,
      cpf,
      password,
    })

    if (result.isLeft()) {
      const error = result.value

      switch(error.constructor) {
        case CpfAlreadyInUseError:
          throw new ConflictException(error.message)
        default:
          throw new BadRequestException(error.message)
      }
    }
  }
}