import { Role } from "@/core/types/roles";
import { AppModule } from "@/infra/app.module";
import { DatabaseModule } from "@/infra/database/database.module";
import { PrismaService } from "@/infra/database/prisma/prisma.service";
import { INestApplication } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { Test } from "@nestjs/testing";
import { hash } from "bcryptjs";
import request from "supertest";
import { DeliveryManFactory } from "test/factories/make-delivery-man";
import { OrderFactory } from "test/factories/make-order";
import { RecipientFactory } from "test/factories/make-recipient";

describe('Mark order as in transit (e2e)', () => {
  let app: INestApplication;
  let jwt: JwtService;
  let prisma: PrismaService;
  let orderFactory: OrderFactory;
  let deliveryManFactory: DeliveryManFactory;
  let recipientFactory: RecipientFactory;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [OrderFactory, DeliveryManFactory, RecipientFactory],
    }).compile()

    app = moduleRef.createNestApplication()
    jwt = moduleRef.get(JwtService)
    prisma = moduleRef.get(PrismaService)

    orderFactory = moduleRef.get(OrderFactory)
    deliveryManFactory = moduleRef.get(DeliveryManFactory)
    recipientFactory = moduleRef.get(RecipientFactory)

    await app.init()
  })

  test('[PATCH] /orders/:orderId/mark-as-in-transit', async () => {
    const deliveryMan = await deliveryManFactory.makePrismaDeliveryMan({
      password: await hash('123456', 8),
    })

    const token = jwt.sign({
      sub: deliveryMan.id.toString(),
      role: Role.DeliveryMan,
    })

    const recipient = await recipientFactory.makePrismaRecipient({
      name: 'Recipient'
    })

    const order = await orderFactory.makePrismaOrder({
      recipientId: recipient.id,
      title: 'Order',
    })

    const response = await request(app.getHttpServer())
      .patch(`/orders/${order.id.toString()}/mark-as-in-transit`)
      .set('Authorization', `Bearer ${token}`)
      .send()

    expect(response.statusCode).toBe(204)

    const orderOnDatabase = await prisma.order.findUnique({
      where: {
        id: order.id.toString(),
      },
    })

    expect(orderOnDatabase?.status).toEqual('IN_TRANSIT')   

  })
})