import { NotAllowedError } from "@/core/errors/use-cases/not-allowed-error";
import { ResourceNotFoundError } from "@/core/errors/use-cases/resource-not-found-error";
import { GetOrderUseCase } from "@/domain/delivery/application/use-cases/get-order";
import { BadRequestException, Controller, Get, HttpCode, Param, UnauthorizedException } from "@nestjs/common";
import { ApiOperation, ApiTags } from "@nestjs/swagger";
import { OrderDetailsPresenter } from "../presenters/order-details-presenter";

@ApiTags('Orders')
@Controller('/orders/:orderId')
export class GetOrderController {
  constructor(
    private getOrder: GetOrderUseCase,
  ) {}

  @Get()
  @HttpCode(200)
  @ApiOperation({ summary: 'Get Order' })
  async handle(
    @Param('orderId') orderId: string,
  ) {
    const result = await this.getOrder.execute({
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

    const { order } = result.value

    return {
      order: OrderDetailsPresenter.toHTTP(order),
    }
  }
}