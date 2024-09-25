import { makeRecipient } from "test/factories/make-recipient";
import { InMemoryOrdersRepository } from "test/repositories/in-memory-orders-repository";
import { InMemoryRecipientsRepository } from "test/repositories/in-memory-recipients-repository";
import { waitFor } from "test/utils/wait-for";
import { SendNotificationUseCase } from "../use-cases/send-notification";
import { OnOrderStatusChanged } from "./on-order-status-changed";
import { makeOrder } from "test/factories/make-order";
import { OrderStatus } from "@/domain/delivery/enterprise/entities/value-objects/order-status";
import { makeDeliveryMan } from "test/factories/make-delivery-man";
import { InMemoryDeliveryMenRepository } from "test/repositories/in-memory-delivery-men-repository";
import { InMemoryNotificationsRepository } from "test/repositories/in-memory-notifications-repository";

let deliveryMenRepository: InMemoryDeliveryMenRepository;
let recipientsRepository: InMemoryRecipientsRepository;
let ordersRepository: InMemoryOrdersRepository;
let notificationsRepository: InMemoryNotificationsRepository;
let sendNotificationUseCase: SendNotificationUseCase;

let sendNotificationExecuteSpy: any

describe('On Order Status Changed - Event', () => {
  beforeEach(() => {
    deliveryMenRepository = new InMemoryDeliveryMenRepository()
    recipientsRepository = new InMemoryRecipientsRepository()
    ordersRepository = new InMemoryOrdersRepository(recipientsRepository)
    
    notificationsRepository = new InMemoryNotificationsRepository()
    sendNotificationUseCase = new SendNotificationUseCase(notificationsRepository)
    
    sendNotificationExecuteSpy = vi.spyOn(sendNotificationUseCase, 'execute')

    new OnOrderStatusChanged(recipientsRepository, sendNotificationUseCase)
  })

  it('should send a notification when an order status is changed', async () => {
    const recipient = makeRecipient()
    recipientsRepository.create(recipient)

    const deliveryMan = makeDeliveryMan()
    deliveryMenRepository.create(deliveryMan)

    const order = makeOrder({
      recipientId: recipient.id,
      status: OrderStatus.create('IN_TRANSIT'),
      deliveryManId: deliveryMan.id,
    })
    ordersRepository.create(order)

    order.status = OrderStatus.create('DELIVERED')
    ordersRepository.save(order)

    await waitFor(() => {
      expect(sendNotificationExecuteSpy).toHaveBeenCalled()
    })
  })
})