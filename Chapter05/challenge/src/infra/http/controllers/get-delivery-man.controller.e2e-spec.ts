import { Role } from "@/core/types/roles";
import { CPF } from "@/domain/delivery/enterprise/entities/value-objects/cpf";
import { Location } from "@/domain/delivery/enterprise/entities/value-objects/location";
import { AppModule } from "@/infra/app.module";
import { DatabaseModule } from "@/infra/database/database.module";
import { INestApplication } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { Test } from "@nestjs/testing";
import { hash } from "bcryptjs";
import request from "supertest";
import { AdminFactory } from "test/factories/make-admin";
import { DeliveryManFactory } from "test/factories/make-delivery-man";

describe('Get DeliveryMan (e2e)', () => {
  let app: INestApplication;
  let jwt: JwtService;
  let deliveryManFactory: DeliveryManFactory;
  let adminFactory: AdminFactory;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [DeliveryManFactory, AdminFactory],
    }).compile()

    app = moduleRef.createNestApplication()
    jwt = moduleRef.get(JwtService)

    deliveryManFactory = moduleRef.get(DeliveryManFactory)
    adminFactory = moduleRef.get(AdminFactory)

    await app.init()
  })

  test('[GET] /delivery-men/:deliveryManId', async () => {
    const admin = await adminFactory.makePrismaAdmin({
      password: await hash('123456', 8),
    })

    const token = jwt.sign({
      sub: admin.id.toString(),
      role: Role.Admin,
    })

    const deliveryMan = await deliveryManFactory.makePrismaDeliveryMan({
      cpf: CPF.create('11122233344'),
      password: await hash('123456', 8),
      name: 'DeliveryMan',
      location: Location.create({
        latitude: 0,
        longitude: 0,
      }),
    })

    const response = await request(app.getHttpServer())
      .get(`/delivery-men/${deliveryMan.id.toString()}`)
      .set('Authorization', `Bearer ${token}`)
      .send()

    expect(response.statusCode).toBe(200)
    expect(response.body.deliveryMan).toEqual({
      id: deliveryMan.id.toString(),
      name: 'DeliveryMan',
      cpf: '11122233344',
      location: {
        latitude: 0,
        longitude: 0,
      },
    })
  })
})