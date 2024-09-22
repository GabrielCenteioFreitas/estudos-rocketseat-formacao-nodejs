import { InMemoryAttachmentsRepository } from 'test/repositories/in-memory-attachments-repository';
import { FakeUploader } from 'test/storage/fake-uploader';
import { InvalidAttachmentTypeError } from './errors/invalid-attachment-type-error';
import { UploadAndCreateAttachmentUseCase } from './upload-and-create-attachment';

let attachmentsRepository: InMemoryAttachmentsRepository;
let fakeUploader: FakeUploader;
let sut: UploadAndCreateAttachmentUseCase;

describe('Upload and create attachment Use Case', () => {
  beforeEach(() => {
    fakeUploader = new FakeUploader()
    attachmentsRepository = new InMemoryAttachmentsRepository()
    sut = new UploadAndCreateAttachmentUseCase(attachmentsRepository, fakeUploader)
  })

  it('should be able to upload and create an attachment', async () => {
    const result = await sut.execute({
      fileName: 'filename.png',
      fileType: 'image/png',
      body: Buffer.from(''),
    })
  
    expect(result.isRight()).toBe(true)
    expect(result.value).toEqual({
      attachment: attachmentsRepository.items[0]
    })
    expect(fakeUploader.uploads).toHaveLength(1)
    expect(fakeUploader.uploads[0]).toEqual(
      expect.objectContaining({
        fileName: 'filename.png'
      })
    )
  })

  it('should not be able to upload an attachment with invalid file type', async () => {
    const result = await sut.execute({
      fileName: 'filename.mp3',
      fileType: 'audio/mpeg',
      body: Buffer.from(''),
    })
  
    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(InvalidAttachmentTypeError)
  })
})
