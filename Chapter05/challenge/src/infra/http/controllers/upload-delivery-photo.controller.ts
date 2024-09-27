import { Role } from "@/core/types/roles";
import { InvalidFileTypeError } from "@/domain/delivery/application/use-cases/errors/invalid-file-type-error";
import { UploadDeliveryPhotoUseCase } from "@/domain/delivery/application/use-cases/upload-delivery-photo";
import { RolesGuard } from "@/infra/auth/rbac/rbac-decorator";
import { BadRequestException, Controller, FileTypeValidator, HttpCode, MaxFileSizeValidator, ParseFilePipe, Post, UploadedFile, UseInterceptors } from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";
import { ApiOperation, ApiTags } from "@nestjs/swagger";

const uploadedFilePipe = new ParseFilePipe({
  validators: [
    new MaxFileSizeValidator({ maxSize: 1024 * 1024 * 8 }), // 8mb
    new FileTypeValidator({ fileType: '.(png|jpg|jpeg)' }),
  ],
})

@ApiTags('Uploads')
@Controller('/uploads/delivery-photo')
@RolesGuard(Role.DeliveryMan)
export class UploadAttachmentController {
  constructor(
    private uploadDeliveryPhoto: UploadDeliveryPhotoUseCase
  ) {}

  @Post()
  @HttpCode(201)
  @ApiOperation({ summary: 'Upload Delivery Photo' })
  @UseInterceptors(FileInterceptor('file'))
  async handle(
    @UploadedFile(uploadedFilePipe) file: Express.Multer.File
  ) {
    const result = await this.uploadDeliveryPhoto.execute({
      fileName: file.originalname,
      fileType: file.mimetype,
      body: file.buffer,
    })

    if (result.isLeft()) {
      const error = result.value

      switch(error.constructor) {
        case InvalidFileTypeError:
        default:
          throw new BadRequestException(error.message)
      }
    }

    const { url } = result.value

    return {
      url,
    }
  }  
}