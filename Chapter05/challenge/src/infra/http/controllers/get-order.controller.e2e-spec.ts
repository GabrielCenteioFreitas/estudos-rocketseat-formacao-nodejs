import { Role } from "@/core/types/roles";
import { AppModule } from "@/infra/app.module";
import { DatabaseModule } from "@/infra/database/database.module";
import { INestApplication } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { Test } from "@nestjs/testing";
import { hash } from "bcryptjs";
import request from "supertest";
import { AdminFactory } from "test/factories/make-admin";
import { OrderFactory } from "test/factories/make-order";
import { RecipientFactory } from "test/factories/make-recipient";

describe('Get order (e2e)', () => {
  let app: INestApplication;
  let jwt: JwtService;
  let orderFactory: OrderFactory;
  let adminFactory: AdminFactory;
  let recipientFactory: RecipientFactory;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [OrderFactory, AdminFactory, RecipientFactory],
    }).compile()

    app = moduleRef.createNestApplication()
    jwt = moduleRef.get(JwtService)

    orderFactory = moduleRef.get(OrderFactory)
    adminFactory = moduleRef.get(AdminFactory)
    recipientFactory = moduleRef.get(RecipientFactory)

    await app.init()
  })

  test('[GET] /orders/:orderId', async () => {
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

    const order = await orderFactory.makePrismaOrder({
      recipientId: recipient.id,
      title: 'Order',
    })

    const response = await request(app.getHttpServer())
      .get(`/orders/${order.id.toString()}`)
      .set('Authorization', `Bearer ${token}`)
      .send()

    expect(response.statusCode).toBe(200)
    expect(response.body.order).toEqual(expect.objectContaining({
      id: order.id.toString(),
      title: 'Order',
      recipient: {
        id: recipient.id.toString(),
        name: 'Recipient',
      },
    }))
  })
})