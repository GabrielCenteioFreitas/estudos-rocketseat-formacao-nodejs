import { NotAllowedError } from "@/core/errors/use-cases/not-allowed-error";
import { ResourceNotFoundError } from "@/core/errors/use-cases/resource-not-found-error";
import { Role } from "@/core/types/roles";
import { FetchDeliveryManOrdersUseCase } from "@/domain/delivery/application/use-cases/fetch-delivery-man-orders";
import { CurrentUser } from "@/infra/auth/current-user.decorator";
import { UserPayload } from "@/infra/auth/jwt.strategy";
import { RolesGuard } from "@/infra/auth/rbac/rbac-decorator";
import { BadRequestException, Controller, Get, HttpCode, Param, UnauthorizedException } from "@nestjs/common";
import { ApiOperation, ApiTags } from "@nestjs/swagger";
import { OrderPresenter } from "../presenters/order-presenter";

@ApiTags('Orders')
@Controller('/delivery-men/:deliveryManId/orders')
@RolesGuard(Role.Admin, Role.DeliveryMan)
export class FetchDeliveryManOrdersController {
  constructor(
    private fetchDeliveryManOrders: FetchDeliveryManOrdersUseCase
  ) {}

  @Get()
  @HttpCode(200)
  @ApiOperation({ summary: 'Fetch Delivery Man Orders' })
  async handle(
    @CurrentUser() user: UserPayload,
    @Param('deliveryManId') deliveryManId: string,
  ) {
    const result = await this.fetchDeliveryManOrders.execute({
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

    const { orders } = result.value

    return {
      orders: orders.map(OrderPresenter.toHTTP),
    }
  }
}