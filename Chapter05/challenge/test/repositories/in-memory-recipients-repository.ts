import { UniqueEntityID } from "@/core/entities/unique-entity-id";
import { RecipientsRepository } from "@/domain/delivery/application/repositories/recipients-repository";
import { Recipient } from "@/domain/delivery/enterprise/entities/recipient";

export class InMemoryRecipientsRepository implements RecipientsRepository {
  public items: Recipient[] = [];

  async create(recipient: Recipient): Promise<void> {
    this.items.push(recipient)
  }

  async save(recipient: Recipient): Promise<void> {
    const itemIndex = this.items.findIndex((item) => item.id.equals(recipient.id))

    this.items[itemIndex] = recipient
  }
  
  async delete(recipient: Recipient): Promise<void> {
    const itemIndex = this.items.findIndex((item) => item.id.equals(recipient.id))

    this.items.splice(itemIndex, 1)
  }
  
  async findById(id: string): Promise<Recipient | null> {
    const recipient = this.items.find(item => item.id.equals(new UniqueEntityID(id)))

    return recipient ?? null
  }

  async findByCPF(cpf: string): Promise<Recipient | null> {
    const recipient = this.items.find(item => item.cpf.equals(cpf))

    return recipient ?? null
  }
}