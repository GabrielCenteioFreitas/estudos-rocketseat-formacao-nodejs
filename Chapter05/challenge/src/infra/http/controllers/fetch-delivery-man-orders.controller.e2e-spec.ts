import { Role } from "@/core/types/roles";
import { OrderStatus } from "@/domain/delivery/enterprise/entities/value-objects/order-status";
import { AppModule } from "@/infra/app.module";
import { DatabaseModule } from "@/infra/database/database.module";
import { INestApplication } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { Test } from "@nestjs/testing";
import request from "supertest";
import { DeliveryManFactory } from "test/factories/make-delivery-man";
import { OrderFactory } from "test/factories/make-order";
import { RecipientFactory } from "test/factories/make-recipient";

describe('Get DeliveryMan orders (e2e)', () => {
  let app: INestApplication;
  let jwt: JwtService;
  let deliveryManFactory: DeliveryManFactory;
  let orderFactory: OrderFactory;
  let recipientFactory: RecipientFactory;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [DeliveryManFactory, RecipientFactory, OrderFactory],
    }).compile()

    app = moduleRef.createNestApplication()
    jwt = moduleRef.get(JwtService)

    deliveryManFactory = moduleRef.get(DeliveryManFactory)
    orderFactory = moduleRef.get(OrderFactory)
    recipientFactory = moduleRef.get(RecipientFactory)

    await app.init()
  })

  test('[GET] /delivery-men/:deliveryManId/orders', async () => {
    const recipient = await recipientFactory.makePrismaRecipient()

    const deliveryMan = await deliveryManFactory.makePrismaDeliveryMan()

    const token = jwt.sign({
      sub: deliveryMan.id.toString(),
      role: Role.DeliveryMan,
    })

    for (let i = 1; i <= 5; i++) {
      await orderFactory.makePrismaOrder({
        title: `Order ${i}`,
        recipientId: recipient.id,
        deliveredAt: new Date(2024, 9, 26),
        deliveryManId: deliveryMan.id,
        deliveryPhotoUrl: 'fake-url',
        status: OrderStatus.create('DELIVERED'),
      })
    }

    const response = await request(app.getHttpServer())
      .get(`/delivery-men/${deliveryMan.id.toString()}/orders`)
      .set('Authorization', `Bearer ${token}`)
      .send()

    expect(response.statusCode).toBe(200)
    expect(response.body.orders).toHaveLength(5)
    expect(response.body.orders).toEqual(expect.arrayContaining([
      expect.objectContaining({
        title: 'Order 1'
      }),
      expect.objectContaining({
        title: 'Order 5'
      }),
    ]))
  })
})