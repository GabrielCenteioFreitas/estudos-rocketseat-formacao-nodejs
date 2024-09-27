import { NotAllowedError } from "@/core/errors/use-cases/not-allowed-error";
import { ResourceNotFoundError } from "@/core/errors/use-cases/resource-not-found-error";
import { Role } from "@/core/types/roles";
import { MarkOrderAsDeliveredUseCase } from "@/domain/delivery/application/use-cases/mark-order-as-delivered";
import { CurrentUser } from "@/infra/auth/current-user.decorator";
import { UserPayload } from "@/infra/auth/jwt.strategy";
import { RolesGuard } from "@/infra/auth/rbac/rbac-decorator";
import { BadRequestException, Body, Controller, HttpCode, Param, Patch, UnauthorizedException } from "@nestjs/common";
import { ApiOperation, ApiTags } from "@nestjs/swagger";
import { z } from "zod";
import { ZodValidationPipe } from "../pipes/zod-validation-pipe";

const markOrderAsDeliveredBodySchema = z.object({
  url: z.string().url(),
})

const bodyValidationPipe = new ZodValidationPipe(markOrderAsDeliveredBodySchema)

type MarkOrderAsDeliveredBodySchema = z.infer<typeof markOrderAsDeliveredBodySchema>

@ApiTags('Orders')
@Controller('/orders/:orderId/mark-as-delivered')
@RolesGuard(Role.DeliveryMan)
export class MarkOrderAsDeliveredController {
  constructor(
    private markOrderAsDelivered: MarkOrderAsDeliveredUseCase,
  ) {}

  @Patch()
  @HttpCode(204)
  @ApiOperation({ summary: 'Mark Order As Delivered' })
  async handle(
    @Param('orderId') orderId: string,
    @Body(bodyValidationPipe) body: MarkOrderAsDeliveredBodySchema,
    @CurrentUser() user: UserPayload,
  ) {
    const { url } = body

    const result = await this.markOrderAsDelivered.execute({
      orderId,
      authorId: user.sub,
      deliveryPhotoUrl: url,
    })

    if (result.isLeft()) {
      const error = result.value

      switch(error.constructor) {
        case NotAllowedError:
          throw new UnauthorizedException(error.message)
        case ResourceNotFoundError:
        default:
          throw new BadRequestException(error.message)
      }
    }
  }
}