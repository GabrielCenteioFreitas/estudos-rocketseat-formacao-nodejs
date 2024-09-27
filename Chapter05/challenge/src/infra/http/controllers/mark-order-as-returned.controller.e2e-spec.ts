import { Role } from "@/core/types/roles";
import { OrderStatus } from "@/domain/delivery/enterprise/entities/value-objects/order-status";
import { AppModule } from "@/infra/app.module";
import { DatabaseModule } from "@/infra/database/database.module";
import { PrismaService } from "@/infra/database/prisma/prisma.service";
import { INestApplication } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { Test } from "@nestjs/testing";
import { hash } from "bcryptjs";
import request from "supertest";
import { AdminFactory } from "test/factories/make-admin";
import { DeliveryManFactory } from "test/factories/make-delivery-man";
import { OrderFactory } from "test/factories/make-order";
import { RecipientFactory } from "test/factories/make-recipient";

describe('Mark order as returned (e2e)', () => {
  let app: INestApplication;
  let jwt: JwtService;
  let prisma: PrismaService;
  let orderFactory: OrderFactory;
  let adminFactory: AdminFactory;
  let recipientFactory: RecipientFactory;
  let deliveryManFactory: DeliveryManFactory;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [OrderFactory, AdminFactory, RecipientFactory, DeliveryManFactory],
    }).compile()

    app = moduleRef.createNestApplication()
    jwt = moduleRef.get(JwtService)
    prisma = moduleRef.get(PrismaService)

    orderFactory = moduleRef.get(OrderFactory)
    adminFactory = moduleRef.get(AdminFactory)
    recipientFactory = moduleRef.get(RecipientFactory)
    deliveryManFactory = moduleRef.get(DeliveryManFactory)

    await app.init()
  })

  test('[PATCH] /orders/:orderId/mark-as-returned', async () => {
    const admin = await adminFactory.makePrismaAdmin({
      password: await hash('123456', 8),
    })

    const token = jwt.sign({
      sub: admin.id.toString(),
      role: Role.Admin,
    })

    const recipient = await recipientFactory.makePrismaRecipient({
      name: 'Recipient'
    })

    const deliveryMan = await deliveryManFactory.makePrismaDeliveryMan({
      password: await hash('123456', 8),
    })

    const order = await orderFactory.makePrismaOrder({
      recipientId: recipient.id,
      title: 'Order',
      deliveryManId: deliveryMan.id,
      deliveryPhotoUrl: 'fake-url',
      status: OrderStatus.create('DELIVERED'),
      deliveredAt: new Date(2024, 9, 26),
    })

    const response = await request(app.getHttpServer())
      .patch(`/orders/${order.id.toString()}/mark-as-returned`)
      .set('Authorization', `Bearer ${token}`)
      .send()

    expect(response.statusCode).toBe(204)

    const orderOnDatabase = await prisma.order.findUnique({
      where: {
        id: order.id.toString(),
      },
    })

    expect(orderOnDatabase?.status).toEqual('RETURNED')   
  })
})