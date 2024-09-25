import { UniqueEntityID } from "@/core/entities/unique-entity-id";
import { DeliveryMenRepository } from "@/domain/delivery/application/repositories/delivery-men-repository";
import { DeliveryMan } from "@/domain/delivery/enterprise/entities/delivery-man";

export class InMemoryDeliveryMenRepository implements DeliveryMenRepository {
  public items: DeliveryMan[] = [];

  async create(deliveryMan: DeliveryMan): Promise<void> {
    this.items.push(deliveryMan)
  }

  async save(deliveryMan: DeliveryMan): Promise<void> {
    const itemIndex = this.items.findIndex((item) => item.id.equals(deliveryMan.id))

    this.items[itemIndex] = deliveryMan
  }
  
  async delete(deliveryMan: DeliveryMan): Promise<void> {
    const itemIndex = this.items.findIndex((item) => item.id.equals(deliveryMan.id))

    this.items.splice(itemIndex, 1)
  }
  
  async findById(id: string): Promise<DeliveryMan | null> {
    const deliveryMan = this.items.find(item => item.id.equals(new UniqueEntityID(id)))

    return deliveryMan ?? null
  }

  async findByCPF(cpf: string): Promise<DeliveryMan | null> {
    const deliveryMan = this.items.find(item => item.cpf.equals(cpf))

    return deliveryMan ?? null
  }
}