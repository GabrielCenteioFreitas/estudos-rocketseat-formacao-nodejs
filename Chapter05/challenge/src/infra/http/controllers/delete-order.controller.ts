import { NotAllowedError } from "@/core/errors/use-cases/not-allowed-error";
import { ResourceNotFoundError } from "@/core/errors/use-cases/resource-not-found-error";
import { Role } from "@/core/types/roles";
import { DeleteOrderUseCase } from "@/domain/delivery/application/use-cases/delete-order";
import { CurrentUser } from "@/infra/auth/current-user.decorator";
import { UserPayload } from "@/infra/auth/jwt.strategy";
import { RolesGuard } from "@/infra/auth/rbac/rbac-decorator";
import { BadRequestException, Controller, Delete, HttpCode, Param, UnauthorizedException } from "@nestjs/common";
import { ApiOperation, ApiTags } from "@nestjs/swagger";

@ApiTags('Orders')
@Controller('/orders/:orderId')
@RolesGuard(Role.Admin)
export class DeleteOrderController {
  constructor(
    private deleteOrder: DeleteOrderUseCase,
  ) {}

  @Delete()
  @HttpCode(204)
  @ApiOperation({ summary: 'Delete Order' })
  async handle(
    @CurrentUser() user: UserPayload,
    @Param('orderId') orderId: string,
  ) {
    const result = await this.deleteOrder.execute({
      authorId: user.sub,
      orderId,
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