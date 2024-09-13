import { Prisma, Org, Role } from "@prisma/client";
import { OrgsRepository } from "../orgs-repository";
import { randomUUID } from "crypto";
import { Decimal } from "@prisma/client/runtime/library";

interface CreateOrgInput extends Prisma.OrgCreateInput{
  latitude: Decimal;
  longitude: Decimal;
}

export class InMemoryOrgsRepository implements OrgsRepository {
  public items: Org[] = []
  
  async create(data: CreateOrgInput) {
    const org = {
      id: randomUUID(),
      role: Role.ADMIN,
      ...data,
    }

    this.items.push(org)

    return org
  }

  async findById(orgId: string) {
    const org = this.items.find(item =>
      item.id === orgId
    )

    return org ?? null
  }

  async findByCep(cep: string) {
    const org = this.items.find(item =>
      item.cep === cep
    )

    return org ?? null
  }

  async findByEmail(email: string) {
    const org = this.items.find(item =>
      item.email === email
    )

    return org ?? null
  }

  async findByPhone(phone: string) {
    const org = this.items.find(item =>
      item.phone === phone
    )

    return org ?? null
  }
}