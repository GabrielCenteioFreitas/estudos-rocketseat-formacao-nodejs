import { DomainEvents } from "@/core/events/domain-events";
import { EventHandler } from "@/core/events/event-handler";
import { RecipientsRepository } from "@/domain/delivery/application/repositories/recipients-repository";
import { Injectable } from "@nestjs/common";
import { SendNotificationUseCase } from "../use-cases/send-notification";
import { OrderStatusChangedEvent } from "@/domain/delivery/enterprise/events/order-status-changed-event";
import { OrderStatus } from "@/domain/delivery/enterprise/entities/value-objects/order-status";

@Injectable()
export class OnOrderStatusChanged implements EventHandler {
  constructor(
    private recipientsRepository: RecipientsRepository,
    private sendNotification: SendNotificationUseCase,
  ) {
    this.setupSubscriptions()
  }

  setupSubscriptions(): void {
    DomainEvents.register(
      this.sendOrderStatusChangeNotification.bind(this),
      OrderStatusChangedEvent.name,
    )
  }

  private formatStatus(status: OrderStatus) {
    switch(status.value) {
      case "PENDING":
        return "Aguardando"
      case "IN_TRANSIT":
        return "Retirado"
      case "DELIVERED":
        return "Entregue"
      case "RETURNED":
        return "Devolvido"
      default:
        break;
    }
  }
  
  private async sendOrderStatusChangeNotification({ order, prevStatus }: OrderStatusChangedEvent) {
    const recipient = await this.recipientsRepository.findById(order.recipientId.toString())

    if (!recipient) {
      return null;
    }

    const formattedPrevStatus = this.formatStatus(prevStatus)
    const formattedNewStatus = this.formatStatus(order.status)

    await this.sendNotification.execute({
      recipientId: order.recipientId.toString(),
      title: `A encomenda ${order.title} teve seu status atualizado!`,
      content: `
        A encomenda ${order.title} teve seu status atualizado de 
        "${formattedPrevStatus}" para "${formattedNewStatus}"!
      `,
    })
  }
}