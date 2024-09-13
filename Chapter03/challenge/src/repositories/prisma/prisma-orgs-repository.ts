import { prisma } from "@/lib/prisma";
import { Prisma } from "@prisma/client";
import { OrgsRepository } from "../orgs-repository";

export class PrismaOrgsRepository implements OrgsRepository {
  async create(data: Prisma.OrgCreateInput) {
    const org = await prisma.org.create({
      data,
    })

    return org
  }

  async findById(orgId: string) {
    const org = await prisma.org.findUnique({
      where: {
        id: orgId,
      }
    })

    return org
  }

  async findByCep(cep: string) {
    const org = await prisma.org.findUnique({
      where: {
        cep,
      }
    })

    return org
  }

  async findByEmail(email: string) {
    const org = await prisma.org.findUnique({
      where: {
        email,
      }
    })

    return org
  }

  async findByPhone(phone: string) {
    const org = await prisma.org.findUnique({
      where: {
        phone,
      }
    })

    return org
  }
}