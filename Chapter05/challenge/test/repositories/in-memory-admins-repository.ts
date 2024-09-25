import { UniqueEntityID } from "@/core/entities/unique-entity-id";
import { AdminsRepository } from "@/domain/delivery/application/repositories/admins-repository";
import { Admin } from "@/domain/delivery/enterprise/entities/admin";

export class InMemoryAdminsRepository implements AdminsRepository {
  public items: Admin[] = [];

  async create(admin: Admin): Promise<void> {
    this.items.push(admin)
  }

  async save(admin: Admin): Promise<void> {
    const itemIndex = this.items.findIndex((item) => item.id.equals(admin.id))

    this.items[itemIndex] = admin
  }

  async findById(id: string): Promise<Admin | null> {
    const admin = this.items.find(item => item.id.equals(new UniqueEntityID(id)))

    return admin ?? null
  }

  async findByCPF(cpf: string): Promise<Admin | null> {
    const admin = this.items.find(item => item.cpf.equals(cpf))

    return admin ?? null
  }
}