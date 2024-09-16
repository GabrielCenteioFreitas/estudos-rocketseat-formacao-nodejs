import { UniqueEntityID } from '@/core/entities/unique-entity-id';
import { makeAnswer } from 'test/factories/make-answer';
import { makeQuestion } from 'test/factories/make-question';
import { InMemoryAnswersRepository } from 'test/repositories/in-memory-answers-repository';
import { InMemoryQuestionsRepository } from 'test/repositories/in-memory-questions-repository';
import { ChooseQuestionBestAnswerUseCase } from './choose-question-best-answer';
import { NotAllowedError } from './errors/not-allowed-error';
import { InMemoryQuestionAttachmentsRepository } from 'test/repositories/in-memory-question-attachments-repository';
import { InMemoryAnswerAttachmentsRepository } from 'test/repositories/in-memory-answer-attachments-repository';

let answersRepository: InMemoryAnswersRepository;
let answerAttachmentsRepository: InMemoryAnswerAttachmentsRepository;
let questionsRepository: InMemoryQuestionsRepository;
let questionAttachmentsRepository: InMemoryQuestionAttachmentsRepository;
let sut: ChooseQuestionBestAnswerUseCase;

describe('Choose Question Best Answer Use Case', () => {
  beforeEach(() => {
    questionAttachmentsRepository = new InMemoryQuestionAttachmentsRepository()
    questionsRepository = new InMemoryQuestionsRepository(questionAttachmentsRepository)
    answerAttachmentsRepository = new InMemoryAnswerAttachmentsRepository()
    answersRepository = new InMemoryAnswersRepository(answerAttachmentsRepository)
    sut = new ChooseQuestionBestAnswerUseCase(
      answersRepository,
      questionsRepository
    )
  })

  it('should be able to choose the question best answer', async () => {
    const question = makeQuestion()
    const answer = makeAnswer({
      questionId: question.id,
    })

    await questionsRepository.create(question)
    await answersRepository.create(answer)

    await sut.execute({
      answerId: answer.id.toString(),
      authorId: question.authorId.toString(),
    })
  
    expect(questionsRepository.items[0].bestAnswerId).toEqual(answer.id)
  })

  it('should not be able to choose another user question best answer', async () => {
    const question = makeQuestion({
      authorId: new UniqueEntityID('author-1')
    })
    const answer = makeAnswer({
      questionId: question.id,
    })

    await questionsRepository.create(question)
    await answersRepository.create(answer)

    const result = await sut.execute({
      answerId: answer.id.toString(),
      authorId: 'author-2',
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(NotAllowedError)
  })
})
