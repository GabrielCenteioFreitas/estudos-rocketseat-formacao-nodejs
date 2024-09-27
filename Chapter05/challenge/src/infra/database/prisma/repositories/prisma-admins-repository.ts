import { AdminsRepository } from "@/domain/delivery/application/repositories/admins-repository";
import { Admin } from "@/domain/delivery/enterprise/entities/admin";
import { PrismaService } from "../prisma.service";
import { PrismaAdminMapper } from "../mappers/prisma-admin-mapper";
import { Injectable } from "@nestjs/common";
import { UserRole } from "@prisma/client";

@Injectable()
export class PrismaAdminsRepository implements AdminsRepository {
  private role: UserRole = 'ADMIN'

  constructor(
    private prisma: PrismaService,
  ) {}

  async create(admin: Admin): Promise<void> {
    const data = PrismaAdminMapper.toPrisma(admin)

    await this.prisma.user.create({
      data,
    })
  }

  async save(admin: Admin): Promise<void> {
    const data = PrismaAdminMapper.toPrisma(admin)

    await this.prisma.user.update({
      where: {
        id: data.id,
        role: this.role,
      },
      data,
    })
  }

  async findByCPF(cpf: string): Promise<Admin | null> {
    const admin = await this.prisma.user.findUnique({
      where: {
        cpf,
        role: this.role,
      }
    })

    if (!admin) {
      return null
    }

    return PrismaAdminMapper.toDomain(admin)
  }

  async findById(id: string): Promise<Admin | null> {
    const admin = await this.prisma.user.findUnique({
      where: {
        id,
        role: this.role,
      }
    })

    if (!admin) {
      return null
    }

    return PrismaAdminMapper.toDomain(admin)
  }
}