import { PaginationParams } from "@/core/repositories/pagination-params";
import { QuestionCommentsRepository } from "@/domain/forum/application/repositories/question-comments-repository";
import { StudentsRepository } from "@/domain/forum/application/repositories/students-repository";
import { QuestionComment } from "@/domain/forum/enterprise/entities/question-comment";
import { InMemoryStudentsRepository } from "./in-memory-students-repository";
import { CommentWithAuthor } from "@/domain/forum/enterprise/entities/value-objects/comment-with-author";

export class InMemoryQuestionCommentsRepository implements QuestionCommentsRepository {
  public items: QuestionComment[] = []

  constructor(
    private studentsRepository: InMemoryStudentsRepository,
  ) {}

  async create(questionComment: QuestionComment) {
    this.items.push(questionComment)
  }

  async delete(questionComment: QuestionComment) {
    const itemIndex = this.items.findIndex((item) => item.id === questionComment.id)

    this.items.splice(itemIndex, 1)
  }

  async findById(id: string) {
    const questionComment = this.items.find(item => item.id.toString() === id)

    return questionComment ?? null
  }

  async findManyByQuestionId(questionId: string, { page }: PaginationParams) {
    const questionComments = this.items
      .filter(item => item.questionId.toString() === questionId)
      .slice((page - 1) * 20, page * 20)

    return questionComments
  }

  async findManyByQuestionIdWithAuthor(questionId: string, { page }: PaginationParams) {
    const commentsWithAuthor = this.items
      .filter(item => item.questionId.toString() === questionId)
      .slice((page - 1) * 20, page * 20)
      .map(comm => {
        const author = this.studentsRepository.items.find(student => 
          student.id.equals(comm.authorId)
        )

        if (!author) {
          throw new Error(`Author with ID "${comm.authorId.toString()}" does not exist.`)
        }

        return CommentWithAuthor.create({
          content: comm.content,
          commentId: comm.id,
          createdAt: comm.createdAt,
          updatedAt: comm.updatedAt,
          authorId: comm.authorId,
          author: author.name,
        })
      })
    
    return commentsWithAuthor
  }
}