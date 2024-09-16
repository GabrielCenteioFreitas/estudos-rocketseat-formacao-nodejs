import { InMemoryNotificationsRepository } from 'test/repositories/in-memory-notifications-repository';
import { SendNotificationUseCase } from './send-notification';

let notificationsRepository: InMemoryNotificationsRepository;
let sut: SendNotificationUseCase;

describe('Send Notification Use Case', () => {
  beforeEach(() => {
    notificationsRepository = new InMemoryNotificationsRepository()
    sut = new SendNotificationUseCase(notificationsRepository)
  })

  it('should be able to send a notification', async () => {
    const result = await sut.execute({
      recipientId: 'recipient-1',
      title: 'New notification',
      content: 'Notification content',
    })
  
    expect(result.isRight()).toBe(true)
    expect(notificationsRepository.items[0]).toEqual(result.value?.notification)
  })
})
