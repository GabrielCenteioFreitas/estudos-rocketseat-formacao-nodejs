import { NotAllowedError } from "@/core/errors/errors/not-allowed-error";
import { ResourceNotFoundError } from "@/core/errors/errors/resource-not-found-error";
import { DeleteAnswerUseCase } from "@/domain/forum/application/use-cases/delete-answer";
import { CurrentUser } from "@/infra/auth/current-user-decorator";
import { UserPayload } from "@/infra/auth/jwt.strategy";
import { BadRequestException, Controller, Delete, HttpCode, Param, UnauthorizedException } from "@nestjs/common";

@Controller('/answers/:id')
export class DeleteAnswerController {
  constructor(
    private deleteAnswer: DeleteAnswerUseCase,
  ) {}

  @Delete()
  @HttpCode(204)
  async handle(
    @CurrentUser() user: UserPayload,
    @Param('id') answerId: string,
  ) {
    const { sub: userId } = user

    const result = await this.deleteAnswer.execute({
      answerId,
      authorId: userId,
    })

    if (result.isLeft()) {
      const error = result.value

      switch(error.constructor) {
        case ResourceNotFoundError:
          throw new BadRequestException(error.message)
        case NotAllowedError:
          throw new UnauthorizedException(error.message)
        default:
          throw new BadRequestException(error.message)
      }
    }
  }  
}