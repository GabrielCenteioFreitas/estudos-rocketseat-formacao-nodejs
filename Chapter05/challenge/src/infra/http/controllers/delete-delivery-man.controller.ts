import { NotAllowedError } from "@/core/errors/use-cases/not-allowed-error";
import { ResourceNotFoundError } from "@/core/errors/use-cases/resource-not-found-error";
import { Role } from "@/core/types/roles";
import { DeleteDeliveryManUseCase } from "@/domain/delivery/application/use-cases/delete-delivery-man";
import { CurrentUser } from "@/infra/auth/current-user.decorator";
import { UserPayload } from "@/infra/auth/jwt.strategy";
import { RolesGuard } from "@/infra/auth/rbac/rbac-decorator";
import { BadRequestException, Controller, Delete, HttpCode, Param, UnauthorizedException } from "@nestjs/common";

@Controller('/delivery-men/:deliveryManId')
@RolesGuard(Role.Admin)
export class DeleteDeliveryManController {
  constructor(
    private deleteDeliveryMan: DeleteDeliveryManUseCase,
  ) {}

  @Delete()
  @HttpCode(204)
  async handle(
    @CurrentUser() user: UserPayload,
    @Param('deliveryManId') deliveryManId: string,
  ) {
    const result = await this.deleteDeliveryMan.execute({
      authorId: user.sub,
      deliveryManId,
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