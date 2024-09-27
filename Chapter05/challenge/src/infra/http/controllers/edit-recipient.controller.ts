import { NotAllowedError } from "@/core/errors/use-cases/not-allowed-error";
import { ResourceNotFoundError } from "@/core/errors/use-cases/resource-not-found-error";
import { Role } from "@/core/types/roles";
import { EditRecipientUseCase } from "@/domain/delivery/application/use-cases/edit-recipient";
import { CurrentUser } from "@/infra/auth/current-user.decorator";
import { UserPayload } from "@/infra/auth/jwt.strategy";
import { RolesGuard } from "@/infra/auth/rbac/rbac-decorator";
import { BadRequestException, Body, Controller, HttpCode, Param, Put, UnauthorizedException } from "@nestjs/common";
import { ApiOperation, ApiTags } from "@nestjs/swagger";
import { z } from "zod";
import { ZodValidationPipe } from "../pipes/zod-validation-pipe";

const editRecipientBodySchema = z.object({
  name: z.string().min(1),
})

const bodyValidationPipe = new ZodValidationPipe(editRecipientBodySchema)

type EditRecipientBodySchema = z.infer<typeof editRecipientBodySchema>

@ApiTags('Recipients')
@Controller('/recipients/:recipientId')
@RolesGuard(Role.Admin)
export class EditRecipientController {
  constructor(
    private editRecipient: EditRecipientUseCase,
  ) {}

  @Put()
  @HttpCode(204)
  @ApiOperation({ summary: 'Edit Recipient' })
  async handle(
    @Body(bodyValidationPipe) body: EditRecipientBodySchema,
    @CurrentUser() user: UserPayload,
    @Param('recipientId') recipientId: string,
  ) {
    const { name } = body

    const result = await this.editRecipient.execute({
      authorId: user.sub,
      recipientId,
      name,
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