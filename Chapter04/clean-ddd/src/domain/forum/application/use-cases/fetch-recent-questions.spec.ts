import { makeQuestion } from 'test/factories/make-question';
import { InMemoryQuestionsRepository } from 'test/repositories/in-memory-questions-repository';
import { FetchRecentQuestionsUseCase } from './fetch-recent-questions';

let questionsRepository: InMemoryQuestionsRepository;
let sut: FetchRecentQuestionsUseCase;

describe('Fetch Recent Questions Use Case', () => {
  beforeEach(() => {
    questionsRepository = new InMemoryQuestionsRepository()
    sut = new FetchRecentQuestionsUseCase(questionsRepository)
  })

  it('should be able to fetch recent questions', async () => {
    await questionsRepository.create(makeQuestion({ createdAt: new Date(2024, 8, 14) }))
    await questionsRepository.create(makeQuestion({ createdAt: new Date(2024, 8, 10) }))
    await questionsRepository.create(makeQuestion({ createdAt: new Date(2024, 8, 15) }))

    const { questions } = await sut.execute({
      page: 1,
    })

    expect(questions).toEqual([
      expect.objectContaining({ createdAt: new Date(2024, 8, 15) }),
      expect.objectContaining({ createdAt: new Date(2024, 8, 14) }),
    ])
  })

  it('should be able to fetch paginated recent questions', async () => {
    for (let i = 1; i <= 22; i++) {
      await questionsRepository.create(
        makeQuestion({ createdAt: new Date() })
      )
    }

    const { questions } = await sut.execute({
      page: 2,
    })

    expect(questions).toHaveLength(2)
  })
})
