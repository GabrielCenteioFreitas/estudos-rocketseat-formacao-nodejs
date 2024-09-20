import { NotAllowedError } from "@/core/errors/errors/not-allowed-error";
import { ResourceNotFoundError } from "@/core/errors/errors/resource-not-found-error";
import { DeleteQuestionCommentUseCase } from "@/domain/forum/application/use-cases/delete-question-comment";
import { CurrentUser } from "@/infra/auth/current-user-decorator";
import { UserPayload } from "@/infra/auth/jwt.strategy";
import { BadRequestException, Controller, Delete, HttpCode, Param, UnauthorizedException } from "@nestjs/common";

@Controller('/questions/comments/:id')
export class DeleteQuestionCommentController {
  constructor(
    private deleteQuestionComment: DeleteQuestionCommentUseCase,
  ) {}

  @Delete()
  @HttpCode(204)
  async handle(
    @CurrentUser() user: UserPayload,
    @Param('id') questionCommentId: string,
  ) {
    const { sub: userId } = user

    const result = await this.deleteQuestionComment.execute({
      questionCommentId,
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