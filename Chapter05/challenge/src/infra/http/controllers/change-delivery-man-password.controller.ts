import { InvalidCredentialsError } from "@/core/errors/use-cases/invalid-credentials-error";
import { NotAllowedError } from "@/core/errors/use-cases/not-allowed-error";
import { ResourceNotFoundError } from "@/core/errors/use-cases/resource-not-found-error";
import { Role } from "@/core/types/roles";
import { ChangeDeliveryManPasswordUseCase } from "@/domain/delivery/application/use-cases/change-delivery-man-password";
import { CurrentUser } from "@/infra/auth/current-user.decorator";
import { UserPayload } from "@/infra/auth/jwt.strategy";
import { RolesGuard } from "@/infra/auth/rbac/rbac-decorator";
import { BadRequestException, Body, Controller, HttpCode, Param, Put, UnauthorizedException } from "@nestjs/common";
import { ApiOperation, ApiTags } from "@nestjs/swagger";
import { z } from "zod";
import { ZodValidationPipe } from "../pipes/zod-validation-pipe";

const changeDeliveryManPasswordBodySchema = z.object({
  password: z.string().min(6),
  newPassword: z.string().min(6),
})

const bodyValidationPipe = new ZodValidationPipe(changeDeliveryManPasswordBodySchema)

type ChangeDeliveryManPasswordBodySchema = z.infer<typeof changeDeliveryManPasswordBodySchema>

@ApiTags('Delivery Men')
@Controller('/delivery-men/:deliveryManId/change-password')
@RolesGuard(Role.Admin)
export class ChangeDeliveryManPasswordController {
  constructor(
    private changeDeliveryManPassword: ChangeDeliveryManPasswordUseCase
  ) {}

  @Put()
  @HttpCode(204)
  @ApiOperation({ summary: 'Change Delivery Man Password' })
  async handle(
    @Body(bodyValidationPipe) body: ChangeDeliveryManPasswordBodySchema,
    @Param('deliveryManId') deliveryManId: string,
    @CurrentUser() user: UserPayload,
  ) {
    const { password, newPassword } = body

    const result = await this.changeDeliveryManPassword.execute({
      authorId: user.sub,
      deliveryManId,
      password,
      newPassword,
    })

    if (result.isLeft()) {
      const error = result.value

      switch(error.constructor) {
        case NotAllowedError:
          throw new UnauthorizedException(error.message)
        case InvalidCredentialsError:
        case ResourceNotFoundError:
        default:
          throw new BadRequestException(error.message)
      }
    }
  }
}