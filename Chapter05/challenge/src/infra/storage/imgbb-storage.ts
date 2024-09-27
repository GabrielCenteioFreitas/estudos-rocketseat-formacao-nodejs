import { Uploader, UploadParams } from "@/domain/delivery/application/storage/uploader";
import { Injectable } from "@nestjs/common";
import { EnvService } from "../env/env.service";

@Injectable()
export class ImgBBStorage implements Uploader {
  constructor(
    private envService: EnvService
  ) {}

  async upload({ body, fileName, fileType }: UploadParams): Promise<{ url: string; }> {
    const formData = new FormData();
    
    const fileBlob = new Blob([body], { type: fileType })
    formData.append('image', fileBlob);
    formData.append('name', fileName);
    formData.append('key', this.envService.get('IMGBB_API_KEY'));

    try {
      const uploadResponse = await fetch(
        'https://api.imgbb.com/1/upload',
        {
          method: 'POST',
          body: formData,
        }
      )

      const responseData = await uploadResponse.json();
      const url: string = responseData.data.url

      if (!url) {
        throw new Error("ImgBB didn't return an URL.")
      }

      return {
        url,
      }
    } catch (error) {
      if (process.env.NODE_ENV !== 'production') {
        console.error(error)
      }

      throw new Error('An unkown error ocurred during the upload.')
    }
  }
}