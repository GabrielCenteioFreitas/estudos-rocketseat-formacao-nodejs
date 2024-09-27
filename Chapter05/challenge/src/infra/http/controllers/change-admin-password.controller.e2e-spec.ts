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

describe('Change admin password (e2e)', () => {
  let app: INestApplication;
  let jwt: JwtService;
  let prisma: PrismaService;
  let adminFactory: AdminFactory;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [AdminFactory],
    }).compile()

    app = moduleRef.createNestApplication()
    prisma = moduleRef.get(PrismaService)
    jwt = moduleRef.get(JwtService)

    adminFactory = moduleRef.get(AdminFactory)

    await app.init()
  })

  test('[PUT] /admins/:adminId/change-password', async () => {
    const admin = await adminFactory.makePrismaAdmin({
      password: await hash('123456', 8),
    })

    const token = jwt.sign({
      sub: admin.id.toString(),
      role: Role.Admin,
    })

    const response = await request(app.getHttpServer())
      .put(`/admins/${admin.id.toString()}/change-password`)
      .set('Authorization', `Bearer ${token}`)
      .send({
        password: '123456',
        newPassword: '123456-updated',
      })

    expect(response.statusCode).toBe(204)

    const adminOnDatabase = await prisma.user.findFirst({
      where: {
        name: admin.name,
      },
    })

    const doesNewPasswordMatch = await compare('123456-updated', adminOnDatabase?.password || '')

    expect(doesNewPasswordMatch).toBeTruthy()
  })
})