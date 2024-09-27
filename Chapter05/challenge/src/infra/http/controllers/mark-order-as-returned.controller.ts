import { NotAllowedError } from "@/core/errors/use-cases/not-allowed-error";
import { ResourceNotFoundError } from "@/core/errors/use-cases/resource-not-found-error";
import { Role } from "@/core/types/roles";
import { MarkOrderAsReturnedUseCase } from "@/domain/delivery/application/use-cases/mark-order-as-returned";
import { CurrentUser } from "@/infra/auth/current-user.decorator";
import { UserPayload } from "@/infra/auth/jwt.strategy";
import { RolesGuard } from "@/infra/auth/rbac/rbac-decorator";
import { BadRequestException, Controller, HttpCode, Param, Patch, UnauthorizedException } from "@nestjs/common";

@Controller('/orders/:orderId/mark-as-returned')
@RolesGuard(Role.Admin)
export class MarkOrderAsReturnedController {
  constructor(
    private markOrderAsReturned: MarkOrderAsReturnedUseCase,
  ) {}

  @Patch()
  @HttpCode(204)
  async handle(
    @Param('orderId') orderId: string,
    @CurrentUser() user: UserPayload,
  ) {
    const result = await this.markOrderAsReturned.execute({
      orderId,
      authorId: user.sub,
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