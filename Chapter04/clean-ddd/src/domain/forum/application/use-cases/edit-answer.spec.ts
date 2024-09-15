import { UniqueEntityID } from '@/core/entities/unique-entity-id';
import { makeAnswer } from 'test/factories/make-answer';
import { InMemoryAnswersRepository } from 'test/repositories/in-memory-answers-repository';
import { EditAnswerUseCase } from './edit-answer';

let answersRepository: InMemoryAnswersRepository;
let sut: EditAnswerUseCase;

describe('Edit Answer Use Case', () => {
  beforeEach(() => {
    answersRepository = new InMemoryAnswersRepository()
    sut = new EditAnswerUseCase(answersRepository)
  })

  it('should be able to edit a answer', async () => {
    const newAnswer = makeAnswer({
      authorId: new UniqueEntityID('author-1')
    }, new UniqueEntityID('answer-1'))

    await answersRepository.create(newAnswer)

    await sut.execute({
      answerId: newAnswer.id.toString(),
      authorId: 'author-1',
      content: 'Test Content',
    })
  
    expect(answersRepository.items[0]).toMatchObject({
      content: 'Test Content',
    })
  })

  it('should not be able to edit a answer from another user', async () => {
    const newAnswer = makeAnswer({
      authorId: new UniqueEntityID('author-1')
    }, new UniqueEntityID('answer-1'))

    await answersRepository.create(newAnswer)

    await expect(() =>
      sut.execute({
        answerId: newAnswer.id.toString(),
        authorId: 'author-2',
        content: 'Test Content',
      })
    ).rejects.toBeInstanceOf(Error)
  })
})
