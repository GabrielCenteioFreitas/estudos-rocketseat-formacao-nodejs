import { NotAllowedError } from "@/core/errors/use-cases/not-allowed-error";
import { ResourceNotFoundError } from "@/core/errors/use-cases/resource-not-found-error";
import { Role } from "@/core/types/roles";
import { GetRecipientUseCase } from "@/domain/delivery/application/use-cases/get-recipient";
import { CurrentUser } from "@/infra/auth/current-user.decorator";
import { UserPayload } from "@/infra/auth/jwt.strategy";
import { RolesGuard } from "@/infra/auth/rbac/rbac-decorator";
import { BadRequestException, Controller, Get, HttpCode, Param, UnauthorizedException } from "@nestjs/common";
import { ApiOperation, ApiTags } from "@nestjs/swagger";
import { RecipientPresenter } from "../presenters/recipient-presenter";

@ApiTags('Recipients')
@Controller('/recipients/:recipientId')
@RolesGuard(Role.Admin)
export class GetRecipientController {
  constructor(
    private getRecipient: GetRecipientUseCase,
  ) {}

  @Get()
  @HttpCode(200)
  @ApiOperation({ summary: 'Get Recipient' })
  async handle(
    @CurrentUser() user: UserPayload,
    @Param('recipientId') recipientId: string,
  ) {
    const result = await this.getRecipient.execute({
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

    const { recipient } = result.value

    return {
      recipient: RecipientPresenter.toHTTP(recipient),
    }
  }
}