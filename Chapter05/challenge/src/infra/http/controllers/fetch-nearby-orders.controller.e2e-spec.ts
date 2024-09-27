import { Role } from "@/core/types/roles";
import { Location } from "@/domain/delivery/enterprise/entities/value-objects/location";
import { AppModule } from "@/infra/app.module";
import { DatabaseModule } from "@/infra/database/database.module";
import { INestApplication } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { Test } from "@nestjs/testing";
import request from "supertest";
import { DeliveryManFactory } from "test/factories/make-delivery-man";
import { OrderFactory } from "test/factories/make-order";
import { RecipientFactory } from "test/factories/make-recipient";

describe('Get nearby orders (e2e)', () => {
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

  test('[GET] /delivery-men/:deliveryManId/nearby-orders', async () => {
    const recipient1 = await recipientFactory.makePrismaRecipient({
      location: Location.create({
        latitude: 0,
        longitude: 0,
      })
    })
    const recipient2 = await recipientFactory.makePrismaRecipient({
      location: Location.create({
        latitude: 10,
        longitude: 10,
      })
    })

    const deliveryMan = await deliveryManFactory.makePrismaDeliveryMan({
      location: Location.create({
        latitude: 0,
        longitude: 0,
      })
    })

    const token = jwt.sign({
      sub: deliveryMan.id.toString(),
      role: Role.DeliveryMan,
    })

    for (let i = 1; i <= 5; i++) {
      await orderFactory.makePrismaOrder({
        title: `Order 1.${i}`,
        recipientId: recipient1.id,
        deliveredAt: new Date(2024, 9, 26),
        deliveryManId: deliveryMan.id,
        deliveryPhotoUrl: 'fake-url',
      })
    }

    for (let i = 1; i <= 5; i++) {
      await orderFactory.makePrismaOrder({
        title: `Order 2.${i}`,
        recipientId: recipient2.id,
        deliveredAt: new Date(2024, 9, 26),
        deliveryManId: deliveryMan.id,
        deliveryPhotoUrl: 'fake-url',
      })
    }

    const response = await request(app.getHttpServer())
      .get(`/delivery-men/${deliveryMan.id.toString()}/nearby-orders`)
      .set('Authorization', `Bearer ${token}`)
      .send()

    expect(response.statusCode).toBe(200)
    expect(response.body.orders).toHaveLength(5)
    expect(response.body.orders).toEqual(expect.arrayContaining([
      expect.objectContaining({
        title: 'Order 1.1'
      }),
    ]))
  })
})