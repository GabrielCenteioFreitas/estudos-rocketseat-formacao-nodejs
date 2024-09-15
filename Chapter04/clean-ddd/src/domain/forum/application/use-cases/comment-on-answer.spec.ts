import { makeAnswer } from 'test/factories/make-answer';
import { InMemoryAnswerCommentsRepository } from 'test/repositories/in-memory-answer-comments-repository';
import { InMemoryAnswersRepository } from 'test/repositories/in-memory-answers-repository';
import { CommentOnAnswerUseCase } from './comment-on-answer';

let answersRepository: InMemoryAnswersRepository;
let answerCommentRepository: InMemoryAnswerCommentsRepository;
let sut: CommentOnAnswerUseCase;

describe('Comment on Answer Use Case', () => {
  beforeEach(() => {
    answersRepository = new InMemoryAnswersRepository()
    answerCommentRepository = new InMemoryAnswerCommentsRepository()
    sut = new CommentOnAnswerUseCase(
      answersRepository,
      answerCommentRepository
    )
  })

  it('should be able to coment on answer', async () => {
    const answer = makeAnswer()

    await answersRepository.create(answer)

    await sut.execute({
      answerId: answer.id.toString(),
      authorId: answer.authorId.toString(),
      content: 'Test Comment'
    })
  
    expect(answerCommentRepository.items[0].content).toEqual('Test Comment')
  })
})
