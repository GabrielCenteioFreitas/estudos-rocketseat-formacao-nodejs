import { FakeUploader } from 'test/storage/fake-uploader';
import { InvalidFileTypeError } from './errors/invalid-file-type-error';
import { UploadDeliveryPhotoUseCase } from './upload-delivery-photo';

let fakeUploader: FakeUploader;
let sut: UploadDeliveryPhotoUseCase;

describe('Upload delivery photo Use Case', () => {
  beforeEach(() => {
    fakeUploader = new FakeUploader()
    sut = new UploadDeliveryPhotoUseCase(fakeUploader)
  })

  it('should be able to upload a delivery photo', async () => {
    const result = await sut.execute({
      fileName: 'filename.png',
      fileType: 'image/png',
      body: Buffer.from(''),
    })
  
    expect(result.isRight()).toBe(true)
    expect(result.value).toEqual({
      url: expect.any(String)
    })
    expect(fakeUploader.uploads).toHaveLength(1)
    expect(fakeUploader.uploads[0]).toEqual(
      expect.objectContaining({
        fileName: 'filename.png'
      })
    )
  })

  it('should not be able to upload a delivery photo with invalid file type', async () => {
    const result = await sut.execute({
      fileName: 'filename.mp3',
      fileType: 'audio/mpeg',
      body: Buffer.from(''),
    })
  
    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(InvalidFileTypeError)
  })
})
