import { Role } from "@/core/types/roles";
import { AppModule } from "@/infra/app.module";
import { DatabaseModule } from "@/infra/database/database.module";
import { INestApplication } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { Test } from "@nestjs/testing";
import request from "supertest";
import { DeliveryManFactory } from "test/factories/make-delivery-man";

describe('Upload delivery photo (e2e)', () => {
  let app: INestApplication;
  let deliveryManFactory: DeliveryManFactory;
  let jwt: JwtService;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [DeliveryManFactory],
    }).compile()

    app = moduleRef.createNestApplication()

    deliveryManFactory = moduleRef.get(DeliveryManFactory)
    jwt = moduleRef.get(JwtService)

    await app.init()
  })

  test.skip('[POST] /uploads/delivery-photo', async () => {
    const deliveryMan = await deliveryManFactory.makePrismaDeliveryMan()

    const token = jwt.sign({
      sub: deliveryMan.id.toString(),
      role: Role.DeliveryMan
    })

    const response = await request(app.getHttpServer())
      .post('/uploads/delivery-photo')
      .set('Authorization', `Bearer ${token}`)
      .attach('file', './test/e2e/upload-delivery-photo-example.png')

    expect(response.statusCode).toBe(201)
    expect(response.body).toEqual({
      url: expect.any(String)
    })
  })
})