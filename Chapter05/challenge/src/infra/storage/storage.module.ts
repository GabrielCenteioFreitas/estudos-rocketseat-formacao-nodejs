import { Module } from "@nestjs/common";

import { Uploader } from "@/domain/delivery/application/storage/uploader";
import { EnvModule } from "../env/env.module";
import { ImgBBStorage } from "./imgbb-storage";


@Module({
  imports: [
    EnvModule,
  ],
  providers: [
    {
      provide: Uploader,
      useClass: ImgBBStorage,
    },
  ],
  exports: [
    Uploader,
  ]
})
export class StorageModule {}