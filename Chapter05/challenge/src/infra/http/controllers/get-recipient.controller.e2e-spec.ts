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
import { RecipientFactory } from "test/factories/make-recipient";

describe('Get recipient (e2e)', () => {
  let app: INestApplication;
  let jwt: JwtService;
  let recipientFactory: RecipientFactory;
  let adminFactory: AdminFactory;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [RecipientFactory, AdminFactory],
    }).compile()

    app = moduleRef.createNestApplication()
    jwt = moduleRef.get(JwtService)

    recipientFactory = moduleRef.get(RecipientFactory)
    adminFactory = moduleRef.get(AdminFactory)

    await app.init()
  })

  test('[GET] /recipients/:recipientId', async () => {
    const admin = await adminFactory.makePrismaAdmin({
      password: await hash('123456', 8),
    })

    const token = jwt.sign({
      sub: admin.id.toString(),
      role: Role.Admin,
    })

    const recipient = await recipientFactory.makePrismaRecipient({
      cpf: CPF.create('11122233344'),
      password: await hash('123456', 8),
      name: 'Recipient',
      location: Location.create({
        latitude: 0,
        longitude: 0,
      }),
    })

    const response = await request(app.getHttpServer())
      .get(`/recipients/${recipient.id.toString()}`)
      .set('Authorization', `Bearer ${token}`)
      .send()

    expect(response.statusCode).toBe(200)
    expect(response.body.recipient).toEqual({
      id: recipient.id.toString(),
      name: 'Recipient',
      cpf: '11122233344',
      location: {
        latitude: 0,
        longitude: 0,
      },
    })
  })
})