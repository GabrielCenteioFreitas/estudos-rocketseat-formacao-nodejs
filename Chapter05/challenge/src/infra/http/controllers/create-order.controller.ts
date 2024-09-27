import { NotAllowedError } from "@/core/errors/use-cases/not-allowed-error";
import { ResourceNotFoundError } from "@/core/errors/use-cases/resource-not-found-error";
import { Role } from "@/core/types/roles";
import { CreateOrderUseCase } from "@/domain/delivery/application/use-cases/create-order";
import { CurrentUser } from "@/infra/auth/current-user.decorator";
import { UserPayload } from "@/infra/auth/jwt.strategy";
import { RolesGuard } from "@/infra/auth/rbac/rbac-decorator";
import { BadRequestException, Body, Controller, HttpCode, Post, UnauthorizedException } from "@nestjs/common";
import { ApiOperation, ApiTags } from "@nestjs/swagger";
import { z } from "zod";
import { ZodValidationPipe } from "../pipes/zod-validation-pipe";

const createOrderBodySchema = z.object({
  title: z.string().min(1),
  recipientId: z.string().uuid(),
})

const bodyValidationPipe = new ZodValidationPipe(createOrderBodySchema)

type CreateOrderBodySchema = z.infer<typeof createOrderBodySchema>

@ApiTags('Orders')
@Controller('/orders')
@RolesGuard(Role.Admin)
export class CreateOrderController {
  constructor(
    private createOrder: CreateOrderUseCase,
  ) {}

  @Post()
  @HttpCode(201)
  @ApiOperation({ summary: 'Create Order' })
  async handle(
    @Body(bodyValidationPipe) body: CreateOrderBodySchema,
    @CurrentUser() user: UserPayload,
  ) {
    const { title, recipientId } = body

    const result = await this.createOrder.execute({
      authorId: user.sub,
      recipientId,
      title,
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