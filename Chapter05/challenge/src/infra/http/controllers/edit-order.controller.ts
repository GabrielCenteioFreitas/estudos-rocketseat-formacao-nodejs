import { NotAllowedError } from "@/core/errors/use-cases/not-allowed-error";
import { ResourceNotFoundError } from "@/core/errors/use-cases/resource-not-found-error";
import { Role } from "@/core/types/roles";
import { EditOrderUseCase } from "@/domain/delivery/application/use-cases/edit-order";
import { CurrentUser } from "@/infra/auth/current-user.decorator";
import { UserPayload } from "@/infra/auth/jwt.strategy";
import { RolesGuard } from "@/infra/auth/rbac/rbac-decorator";
import { BadRequestException, Body, Controller, HttpCode, Param, Put, UnauthorizedException } from "@nestjs/common";
import { ApiOperation, ApiTags } from "@nestjs/swagger";
import { z } from "zod";
import { ZodValidationPipe } from "../pipes/zod-validation-pipe";

const editOrderBodySchema = z.object({
  title: z.string().min(1),
  recipientId: z.string().uuid(),
})

const bodyValidationPipe = new ZodValidationPipe(editOrderBodySchema)

type EditOrderBodySchema = z.infer<typeof editOrderBodySchema>

@ApiTags('Recipients')
@Controller('/orders/:orderId')
@RolesGuard(Role.Admin)
export class EditOrderController {
  constructor(
    private editOrder: EditOrderUseCase,
  ) {}

  @Put()
  @HttpCode(204)
  @ApiOperation({ summary: 'Edit Recipient' })
  async handle(
    @Body(bodyValidationPipe) body: EditOrderBodySchema,
    @CurrentUser() user: UserPayload,
    @Param('orderId') orderId: string,
  ) {
    const { title, recipientId } = body

    const result = await this.editOrder.execute({
      authorId: user.sub,
      orderId,
      title,
      recipientId,
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