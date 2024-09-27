import { Role } from "@/core/types/roles";
import { AppModule } from "@/infra/app.module";
import { DatabaseModule } from "@/infra/database/database.module";
import { PrismaService } from "@/infra/database/prisma/prisma.service";
import { INestApplication } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { Test } from "@nestjs/testing";
import { compare, hash } from "bcryptjs";
import request from "supertest";
import { AdminFactory } from "test/factories/make-admin";
import { DeliveryManFactory } from "test/factories/make-delivery-man";

describe('Change deliveryMan password (e2e)', () => {
  let app: INestApplication;
  let jwt: JwtService;
  let prisma: PrismaService;
  let deliveryManFactory: DeliveryManFactory;
  let adminFactory: AdminFactory;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [DeliveryManFactory, AdminFactory],
    }).compile()

    app = moduleRef.createNestApplication()
    prisma = moduleRef.get(PrismaService)
    jwt = moduleRef.get(JwtService)

    deliveryManFactory = moduleRef.get(DeliveryManFactory)
    adminFactory = moduleRef.get(AdminFactory)

    await app.init()
  })

  test('[PUT] /delivery-men/:deliveryManId/change-password', async () => {
    const admin = await adminFactory.makePrismaAdmin({
      password: await hash('123456', 8),
    })

    const token = jwt.sign({
      sub: admin.id.toString(),
      role: Role.Admin,
    })

    const deliveryMan = await deliveryManFactory.makePrismaDeliveryMan({
      password: await hash('123456', 8),
    })

    const response = await request(app.getHttpServer())
      .put(`/delivery-men/${deliveryMan.id.toString()}/change-password`)
      .set('Authorization', `Bearer ${token}`)
      .send({
        password: '123456',
        newPassword: '123456-updated',
      })

    expect(response.statusCode).toBe(204)

    const deliveryManOnDatabase = await prisma.user.findFirst({
      where: {
        name: deliveryMan.name,
      },
    })

    const doesNewPasswordMatch = await compare('123456-updated', deliveryManOnDatabase?.password || '')

    expect(doesNewPasswordMatch).toBeTruthy()
  })
})