import { UniqueEntityID } from '@/core/entities/unique-entity-id';
import { makeAnswer } from 'test/factories/make-answer';
import { InMemoryAnswersRepository } from 'test/repositories/in-memory-answers-repository';
import { DeleteAnswerUseCase } from './delete-answer';
import { NotAllowedError } from './errors/not-allowed-error';
import { InMemoryAnswerAttachmentsRepository } from 'test/repositories/in-memory-answer-attachments-repository';
import { makeAnswerAttachment } from 'test/factories/make-answer-attachment';

let answersRepository: InMemoryAnswersRepository;
let answerAttachmentsRepository: InMemoryAnswerAttachmentsRepository;
let sut: DeleteAnswerUseCase;

describe('Delete Answer Use Case', () => {
  beforeEach(() => {
    answerAttachmentsRepository = new InMemoryAnswerAttachmentsRepository()
    answersRepository = new InMemoryAnswersRepository(answerAttachmentsRepository)
    sut = new DeleteAnswerUseCase(answersRepository)
  })

  it('should be able to delete a answer', async () => {
    const newAnswer = makeAnswer({
      authorId: new UniqueEntityID('author-1')
    }, new UniqueEntityID('answer-1'))

    await answersRepository.create(newAnswer)

    answerAttachmentsRepository.items.push(
      makeAnswerAttachment({
        answerId: new UniqueEntityID('answer-1'),
        attachmentId: new UniqueEntityID('1'),
      }),
      makeAnswerAttachment({
        answerId: new UniqueEntityID('answer-1'),
        attachmentId: new UniqueEntityID('2'),
      }),
    )

    await sut.execute({
      answerId: 'answer-1',
      authorId: 'author-1',
    })
  
    expect(answersRepository.items).toHaveLength(0)
    expect(answerAttachmentsRepository.items).toHaveLength(0)
  })

  it('should not be able to delete a answer from another user', async () => {
    const newAnswer = makeAnswer({
      authorId: new UniqueEntityID('author-1')
    }, new UniqueEntityID('answer-1'))

    await answersRepository.create(newAnswer)

    const result = await sut.execute({
      answerId: 'answer-1',
      authorId: 'author-2',
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(NotAllowedError)
  })
})
