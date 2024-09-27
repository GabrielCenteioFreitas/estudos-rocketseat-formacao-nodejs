import { Module } from "@nestjs/common";
import { PrismaService } from "./prisma/prisma.service";
import { AdminsRepository } from "@/domain/delivery/application/repositories/admins-repository";
import { PrismaAdminsRepository } from "./prisma/repositories/prisma-admins-repository";
import { RecipientsRepository } from "@/domain/delivery/application/repositories/recipients-repository";
import { PrismaRecipientsRepository } from "./prisma/repositories/prisma-recipients-repository";
import { DeliveryMenRepository } from "@/domain/delivery/application/repositories/delivery-men-repository";
import { PrismaDeliveryMenRepository } from "./prisma/repositories/prisma-delivery-men-repository";
import { OrdersRepository } from "@/domain/delivery/application/repositories/orders-repository";
import { PrismaOrdersRepository } from "./prisma/repositories/prisma-orders-repository";
import { NotificationsRepository } from "@/domain/notification/application/repositories/notifications-repository";
import { PrismaNotificationsRepository } from "./prisma/repositories/prisma-notifications-repository";
import { CacheModule } from "../cache/cache.module";

@Module({
  imports: [CacheModule],
  providers: [
    PrismaService,
    {
      provide: AdminsRepository,
      useClass: PrismaAdminsRepository,
    },
    {
      provide: RecipientsRepository,
      useClass: PrismaRecipientsRepository,
    },
    {
      provide: DeliveryMenRepository,
      useClass: PrismaDeliveryMenRepository,
    },
    {
      provide: OrdersRepository,
      useClass: PrismaOrdersRepository,
    },
    {
      provide: NotificationsRepository,
      useClass: PrismaNotificationsRepository,
    },
  ],
  exports: [
    PrismaService,
    AdminsRepository,
    RecipientsRepository,
    DeliveryMenRepository,
    OrdersRepository,
    NotificationsRepository,
  ],
})
export class DatabaseModule {}