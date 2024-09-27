import { InvalidCredentialsError } from "@/core/errors/use-cases/invalid-credentials-error";
import { NotAllowedError } from "@/core/errors/use-cases/not-allowed-error";
import { ResourceNotFoundError } from "@/core/errors/use-cases/resource-not-found-error";
import { Role } from "@/core/types/roles";
import { ChangeRecipientPasswordUseCase } from "@/domain/delivery/application/use-cases/change-recipient-password";
import { CurrentUser } from "@/infra/auth/current-user.decorator";
import { UserPayload } from "@/infra/auth/jwt.strategy";
import { RolesGuard } from "@/infra/auth/rbac/rbac-decorator";
import { BadRequestException, Body, Controller, HttpCode, Param, Put, UnauthorizedException } from "@nestjs/common";
import { ApiOperation, ApiTags } from "@nestjs/swagger";
import { z } from "zod";
import { ZodValidationPipe } from "../pipes/zod-validation-pipe";

const changeRecipientPasswordBodySchema = z.object({
  password: z.string().min(6),
  newPassword: z.string().min(6),
})

const bodyValidationPipe = new ZodValidationPipe(changeRecipientPasswordBodySchema)

type ChangeRecipientPasswordBodySchema = z.infer<typeof changeRecipientPasswordBodySchema>

@ApiTags('Recipients')
@Controller('/recipients/:recipientId/change-password')
@RolesGuard(Role.Admin)
export class ChangeRecipientPasswordController {
  constructor(
    private changeRecipientPassword: ChangeRecipientPasswordUseCase
  ) {}

  @Put()
  @HttpCode(204)
  @ApiOperation({ summary: 'Change Recipient Password' })
  async handle(
    @Body(bodyValidationPipe) body: ChangeRecipientPasswordBodySchema,
    @Param('recipientId') recipientId: string,
    @CurrentUser() user: UserPayload,
  ) {
    const { password, newPassword } = body

    const result = await this.changeRecipientPassword.execute({
      authorId: user.sub,
      recipientId,
      password,
      newPassword,
    })

    if (result.isLeft()) {
      const error = result.value

      switch(error.constructor) {
        case NotAllowedError:
          throw new UnauthorizedException(error.message)
        case InvalidCredentialsError:
        case ResourceNotFoundError:
        default:
          throw new BadRequestException(error.message)
      }
    }
  }
}