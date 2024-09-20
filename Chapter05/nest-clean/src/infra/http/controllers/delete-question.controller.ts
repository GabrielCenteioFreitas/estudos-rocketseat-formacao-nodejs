import { NotAllowedError } from "@/core/errors/errors/not-allowed-error";
import { ResourceNotFoundError } from "@/core/errors/errors/resource-not-found-error";
import { DeleteQuestionUseCase } from "@/domain/forum/application/use-cases/delete-question";
import { CurrentUser } from "@/infra/auth/current-user-decorator";
import { UserPayload } from "@/infra/auth/jwt.strategy";
import { BadRequestException, Controller, Delete, HttpCode, Param, UnauthorizedException } from "@nestjs/common";

@Controller('/questions/:id')
export class DeleteQuestionController {
  constructor(
    private deleteQuestion: DeleteQuestionUseCase,
  ) {}

  @Delete()
  @HttpCode(204)
  async handle(
    @CurrentUser() user: UserPayload,
    @Param('id') questionId: string,
  ) {
    const { sub: userId } = user

    const result = await this.deleteQuestion.execute({
      questionId,
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