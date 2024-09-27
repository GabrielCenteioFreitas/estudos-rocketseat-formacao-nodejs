import { CpfAlreadyInUseError } from "@/core/errors/use-cases/cpf-already-in-use-error";
import { RegisterRecipientUseCase } from "@/domain/delivery/application/use-cases/register-recipient";
import { Public } from "@/infra/auth/public";
import { BadRequestException, Body, ConflictException, Controller, HttpCode, Post } from "@nestjs/common";
import { z } from "zod";
import { ZodValidationPipe } from "../pipes/zod-validation-pipe";

const registerRecipientBodySchema = z.object({
  name: z.string().min(1),
  cpf: z.string().length(11),
  password: z.string().min(6),
  location: z.object({
    latitude: z.number().max(90).min(-90),
    longitude: z.number().max(180).min(-180),
  })
})

const bodyValidationPipe = new ZodValidationPipe(registerRecipientBodySchema)

type RegisterRecipientBodySchema = z.infer<typeof registerRecipientBodySchema>

@Controller('/register/recipient')
@Public()
export class RegisterRecipientController {
  constructor(
    private registerRecipient: RegisterRecipientUseCase
  ) {}

  @Post()
  @HttpCode(201)
  async handle(
    @Body(bodyValidationPipe) body: RegisterRecipientBodySchema
  ) {
    const { cpf, name, password, location } = body

    const result = await this.registerRecipient.execute({
      name,
      cpf,
      password,
      location,
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