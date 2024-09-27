import { Either, left, right } from "@/core/either";
import { Injectable } from "@nestjs/common";
import { Uploader } from "../storage/uploader";
import { InvalidFileTypeError } from "./errors/invalid-file-type-error";

interface UploadDeliveryPhotoUseCaseRequest {
  body: Buffer;
  fileName: string;
  fileType: string;
}

type UploadDeliveryPhotoUseCaseResponse = Either<
  InvalidFileTypeError,
  {
    url: string;
  }
>

@Injectable()
export class UploadDeliveryPhotoUseCase {
  constructor(
    private uploader: Uploader,
  ) {}

  async execute({
    body,
    fileName,
    fileType,
  }: UploadDeliveryPhotoUseCaseRequest): Promise<UploadDeliveryPhotoUseCaseResponse> {
    const fileTypeRegex = /^(image\/(png|jpg|jpeg))$/
    const isFileTypeValid = fileTypeRegex.test(fileType)
    if (!isFileTypeValid) {
      return left(new InvalidFileTypeError(fileType))
    }

    const { url } = await this.uploader.upload({
      fileName,
      fileType,
      body,
    })

    return right({
      url,
    })
  }
}