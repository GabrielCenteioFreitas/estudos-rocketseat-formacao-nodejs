import { FakeHasher } from 'test/cryptography/fake-hasher';
import { InMemoryStudentsRepository } from 'test/repositories/in-memory-students-repository';
import { RegisterStudentUseCase } from './register-student';
import { StudentAlreadyExistsError } from './errors/student-already-exists-error';

let studentsRepository: InMemoryStudentsRepository;
let fakeHasher: FakeHasher;
let sut: RegisterStudentUseCase;

describe('Register Student Use Case', () => {
  beforeEach(() => {
    fakeHasher = new FakeHasher()
    studentsRepository = new InMemoryStudentsRepository()
    sut = new RegisterStudentUseCase(studentsRepository, fakeHasher)
  })

  it('should be able to register a new student', async () => {
    const result = await sut.execute({
      name: 'John Doe',
      email: 'johndoe@example.com',
      password: '123456',
    })
  
    expect(result.isRight()).toBe(true)
    expect(result.value).toEqual({
      student: studentsRepository.items[0]
    })
  })

  it('should not be able to register a student with same email twice', async () => {
    await sut.execute({
      name: 'John Doe',
      email: 'johndoe@example.com',
      password: '123456',
    })

    const result = await sut.execute({
      name: 'John Doe 2',
      email: 'johndoe@example.com',
      password: '123456',
    })
  
    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(StudentAlreadyExistsError)
  })

  it('should hash student password upon registration', async () => {
    const result = await sut.execute({
      name: 'John Doe',
      email: 'johndoe@example.com',
      password: '123456',
    })

    const hashedPassword = await fakeHasher.hash('123456')
  
    expect(result.isRight()).toBe(true)
    expect(studentsRepository.items[0].password).toEqual(hashedPassword)
  })
})
