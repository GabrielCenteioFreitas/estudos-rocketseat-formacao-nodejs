import { InMemoryAnswersRepository } from 'test/repositories/in-memory-answers-repository';
import { AnswerQuestionUseCase } from './answer-question';
import { UniqueEntityID } from '@/core/entities/unique-entity-id';
import { InMemoryAnswerAttachmentsRepository } from 'test/repositories/in-memory-answer-attachments-repository';

let answersRepository: InMemoryAnswersRepository;
let answerAttachmentsRepository: InMemoryAnswerAttachmentsRepository;
let sut: AnswerQuestionUseCase;

describe('Answer Question Use Case', () => {
  beforeEach(() => {
    answerAttachmentsRepository = new InMemoryAnswerAttachmentsRepository()
    answersRepository = new InMemoryAnswersRepository(answerAttachmentsRepository)
    sut = new AnswerQuestionUseCase(answersRepository)
  })

  it('should be able to answer a question', async () => {
    const result = await sut.execute({
      questionId: '1',
      instructorId: '1',
      content: 'New answer',
      attachmentsIds: ['1', '2'],
    })
  
    expect(result.isRight()).toBe(true)
    expect(answersRepository.items[0]).toEqual(result.value?.answer)
    expect(answersRepository.items[0].attachments.getItems()).toHaveLength(2)
    expect(answersRepository.items[0].attachments.getItems()).toEqual([
      expect.objectContaining({ attachmentId: new UniqueEntityID('1') }),
      expect.objectContaining({ attachmentId: new UniqueEntityID('2') }),
    ])
  })
})
