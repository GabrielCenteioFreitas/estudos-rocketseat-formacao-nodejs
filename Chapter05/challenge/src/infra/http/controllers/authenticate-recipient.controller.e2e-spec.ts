import { CPF } from "@/domain/delivery/enterprise/entities/value-objects/cpf";
import { AppModule } from "@/infra/app.module";
import { DatabaseModule } from "@/infra/database/database.module";
import { INestApplication } from "@nestjs/common";
import { Test } from "@nestjs/testing";
import { hash } from "bcryptjs";
import request from "supertest";
import { RecipientFactory } from "test/factories/make-recipient";

describe('Authenticate recipient (e2e)', () => {
  let app: INestApplication;
  let recipientFactory: RecipientFactory;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [RecipientFactory],
    }).compile()

    app = moduleRef.createNestApplication()

    recipientFactory = moduleRef.get(RecipientFactory)

    await app.init()
  })

  test('[POST] /sessions/recipient', async () => {
    await recipientFactory.makePrismaRecipient({
      cpf: CPF.create('11122233344'),
      password: await hash('123456', 8),
    })

    const response = await request(app.getHttpServer())
      .post('/sessions/recipient')
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