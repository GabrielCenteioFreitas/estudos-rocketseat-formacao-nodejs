import { CPF } from "@/domain/delivery/enterprise/entities/value-objects/cpf";
import { AppModule } from "@/infra/app.module";
import { DatabaseModule } from "@/infra/database/database.module";
import { INestApplication } from "@nestjs/common";
import { Test } from "@nestjs/testing";
import { hash } from "bcryptjs";
import request from "supertest";
import { DeliveryManFactory } from "test/factories/make-delivery-man";

describe('Authenticate deliveryMan (e2e)', () => {
  let app: INestApplication;
  let deliveryManFactory: DeliveryManFactory;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [DeliveryManFactory],
    }).compile()

    app = moduleRef.createNestApplication()

    deliveryManFactory = moduleRef.get(DeliveryManFactory)

    await app.init()
  })

  test('[POST] /sessions/delivery-man', async () => {
    await deliveryManFactory.makePrismaDeliveryMan({
      cpf: CPF.create('11122233344'),
      password: await hash('123456', 8),
    })

    const response = await request(app.getHttpServer())
      .post('/sessions/delivery-man')
      .send({
        cpf: '11122233344',
        password: '123456',
      })

    expect(response.statusCode).toBe(200)
    expect(response.body).toEqual({
      token: expect.any(String)
    })
  })
})