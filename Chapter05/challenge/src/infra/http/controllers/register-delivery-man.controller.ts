import { CpfAlreadyInUseError } from "@/core/errors/use-cases/cpf-already-in-use-error";
import { RegisterDeliveryManUseCase } from "@/domain/delivery/application/use-cases/register-delivery-man";
import { Public } from "@/infra/auth/public";
import { BadRequestException, Body, ConflictException, Controller, HttpCode, Post } from "@nestjs/common";
import { z } from "zod";
import { ZodValidationPipe } from "../pipes/zod-validation-pipe";

const registerDeliveryManBodySchema = z.object({
  name: z.string().min(1),
  cpf: z.string().length(11),
  password: z.string().min(6),
  location: z.object({
    latitude: z.number().max(90).min(-90),
    longitude: z.number().max(180).min(-180),
  })
})

const bodyValidationPipe = new ZodValidationPipe(registerDeliveryManBodySchema)

type RegisterDeliveryManBodySchema = z.infer<typeof registerDeliveryManBodySchema>

@Controller('/register/delivery-man')
@Public()
export class RegisterDeliveryManController {
  constructor(
    private registerDeliveryMan: RegisterDeliveryManUseCase
  ) {}

  @Post()
  @HttpCode(201)
  async handle(
    @Body(bodyValidationPipe) body: RegisterDeliveryManBodySchema
  ) {
    const { cpf, name, password, location } = body

    const result = await this.registerDeliveryMan.execute({
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