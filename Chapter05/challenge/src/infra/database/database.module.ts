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

@Module({
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
  ],
  exports: [
    PrismaService,
    AdminsRepository,
    RecipientsRepository,
    DeliveryMenRepository,
    OrdersRepository,
  ],
})
export class DatabaseModule {}