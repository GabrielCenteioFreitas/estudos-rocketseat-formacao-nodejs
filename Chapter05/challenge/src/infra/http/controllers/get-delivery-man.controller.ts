import { NotAllowedError } from "@/core/errors/use-cases/not-allowed-error";
import { ResourceNotFoundError } from "@/core/errors/use-cases/resource-not-found-error";
import { Role } from "@/core/types/roles";
import { GetDeliveryManUseCase } from "@/domain/delivery/application/use-cases/get-delivery-man";
import { CurrentUser } from "@/infra/auth/current-user.decorator";
import { UserPayload } from "@/infra/auth/jwt.strategy";
import { RolesGuard } from "@/infra/auth/rbac/rbac-decorator";
import { BadRequestException, Controller, Get, HttpCode, Param, UnauthorizedException } from "@nestjs/common";
import { ApiOperation, ApiTags } from "@nestjs/swagger";
import { DeliveryManPresenter } from "../presenters/delivery-man-presenter";

@ApiTags('Delivery Men')
@Controller('/delivery-men/:deliveryManId')
@RolesGuard(Role.Admin)
export class GetDeliveryManController {
  constructor(
    private getDeliveryMan: GetDeliveryManUseCase,
  ) {}

  @Get()
  @HttpCode(200)
  @ApiOperation({ summary: 'Get Delivery Man' })
  async handle(
    @CurrentUser() user: UserPayload,
    @Param('deliveryManId') deliveryManId: string,
  ) {
    const result = await this.getDeliveryMan.execute({
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

    const { deliveryMan } = result.value

    return {
      deliveryMan: DeliveryManPresenter.toHTTP(deliveryMan),
    }
  }
}