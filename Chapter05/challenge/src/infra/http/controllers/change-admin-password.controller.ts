import { InvalidCredentialsError } from "@/core/errors/use-cases/invalid-credentials-error";
import { Role } from "@/core/types/roles";
import { ChangeAdminPasswordUseCase } from "@/domain/delivery/application/use-cases/change-admin-password";
import { CurrentUser } from "@/infra/auth/current-user.decorator";
import { UserPayload } from "@/infra/auth/jwt.strategy";
import { RolesGuard } from "@/infra/auth/rbac/rbac-decorator";
import { BadRequestException, Body, Controller, HttpCode, Param, Post, Put, UnauthorizedException } from "@nestjs/common";
import { z } from "zod";
import { ZodValidationPipe } from "../pipes/zod-validation-pipe";
import { ResourceNotFoundError } from "@/core/errors/use-cases/resource-not-found-error";
import { NotAllowedError } from "@/core/errors/use-cases/not-allowed-error";

const changeAdminPasswordBodySchema = z.object({
  password: z.string().min(6),
  newPassword: z.string().min(6),
})

const bodyValidationPipe = new ZodValidationPipe(changeAdminPasswordBodySchema)

type ChangeAdminPasswordBodySchema = z.infer<typeof changeAdminPasswordBodySchema>

@Controller('/admins/:adminId/change-password')
@RolesGuard(Role.Admin)
export class ChangeAdminPasswordController {
  constructor(
    private changeAdminPassword: ChangeAdminPasswordUseCase
  ) {}

  @Put()
  @HttpCode(204)
  async handle(
    @Body(bodyValidationPipe) body: ChangeAdminPasswordBodySchema,
    @Param('adminId') adminId: string,
    @CurrentUser() user: UserPayload,
  ) {
    const { password, newPassword } = body

    const result = await this.changeAdminPassword.execute({
      authorId: user.sub,
      adminId,
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