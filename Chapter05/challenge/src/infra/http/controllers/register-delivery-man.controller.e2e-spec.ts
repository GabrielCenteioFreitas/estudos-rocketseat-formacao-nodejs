import { AppModule } from "@/infra/app.module";
import { PrismaService } from "@/infra/database/prisma/prisma.service";
import { INestApplication } from "@nestjs/common";
import { Test } from "@nestjs/testing";
import request from "supertest";

describe('Register DeliveryMan (e2e)', () => {
  let app: INestApplication;
  let prisma: PrismaService;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile()

    app = moduleRef.createNestApplication()

    prisma = moduleRef.get(PrismaService)

    await app.init()
  })

  test('[POST] /register/delivery-man', async () => {
    const response = await request(app.getHttpServer())
      .post('/register/delivery-man')
      .send({
        name: 'DeliveryMan',
        cpf: '11122233344',
        password: '123456',
        location: {
          longitude: 0,
          latitude: 0,
        }
      })

    expect(response.statusCode).toBe(201)

    const userOnDatabase = await prisma.user.findUnique({
      where: {
        cpf: '11122233344',
      }
    })

    expect(userOnDatabase).toBeTruthy()
  })
})