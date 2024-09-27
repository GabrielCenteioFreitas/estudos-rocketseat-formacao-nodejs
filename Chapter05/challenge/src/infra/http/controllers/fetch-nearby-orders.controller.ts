import { NotAllowedError } from "@/core/errors/use-cases/not-allowed-error";
import { ResourceNotFoundError } from "@/core/errors/use-cases/resource-not-found-error";
import { Role } from "@/core/types/roles";
import { CurrentUser } from "@/infra/auth/current-user.decorator";
import { UserPayload } from "@/infra/auth/jwt.strategy";
import { RolesGuard } from "@/infra/auth/rbac/rbac-decorator";
import { BadRequestException, Controller, Get, HttpCode, Param, UnauthorizedException } from "@nestjs/common";
import { OrderPresenter } from "../presenters/order-presenter";
import { FetchNearbyOrdersUseCase } from "@/domain/delivery/application/use-cases/fetch-nearby-orders";

@Controller('/delivery-men/:deliveryManId/nearby-orders')
@RolesGuard(Role.DeliveryMan)
export class FetchNearbyOrdersController {
  constructor(
    private fetchNearbyOrders: FetchNearbyOrdersUseCase
  ) {}

  @Get()
  @HttpCode(200)
  async handle(
    @CurrentUser() user: UserPayload,
    @Param('deliveryManId') deliveryManId: string,
  ) {
    const result = await this.fetchNearbyOrders.execute({
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