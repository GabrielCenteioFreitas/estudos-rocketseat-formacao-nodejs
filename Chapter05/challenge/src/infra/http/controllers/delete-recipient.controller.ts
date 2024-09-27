import { NotAllowedError } from "@/core/errors/use-cases/not-allowed-error";
import { ResourceNotFoundError } from "@/core/errors/use-cases/resource-not-found-error";
import { Role } from "@/core/types/roles";
import { DeleteRecipientUseCase } from "@/domain/delivery/application/use-cases/delete-recipient";
import { CurrentUser } from "@/infra/auth/current-user.decorator";
import { UserPayload } from "@/infra/auth/jwt.strategy";
import { RolesGuard } from "@/infra/auth/rbac/rbac-decorator";
import { BadRequestException, Controller, Delete, HttpCode, Param, UnauthorizedException } from "@nestjs/common";
import { ApiOperation, ApiTags } from "@nestjs/swagger";

@ApiTags('Recipients')
@Controller('/recipients/:recipientId')
@RolesGuard(Role.Admin)
export class DeleteRecipientController {
  constructor(
    private deleteRecipient: DeleteRecipientUseCase,
  ) {}

  @Delete()
  @HttpCode(204)
  @ApiOperation({ summary: 'Delete Recipient' })
  async handle(
    @CurrentUser() user: UserPayload,
    @Param('recipientId') recipientId: string,
  ) {
    const result = await this.deleteRecipient.execute({
      authorId: user.sub,
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