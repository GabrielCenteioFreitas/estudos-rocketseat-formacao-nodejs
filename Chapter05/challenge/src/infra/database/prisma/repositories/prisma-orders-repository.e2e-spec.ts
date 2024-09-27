import { OrdersRepository } from "@/domain/delivery/application/repositories/orders-repository";
import { AppModule } from "@/infra/app.module";
import { CacheRepository } from "@/infra/cache/cache-repository";
import { CacheModule } from "@/infra/cache/cache.module";
import { DatabaseModule } from "@/infra/database/database.module";
import { INestApplication } from "@nestjs/common";
import { Test } from "@nestjs/testing";
import { OrderFactory } from "test/factories/make-order";
import { RecipientFactory } from "test/factories/make-recipient";
import { PrismaOrderMapper } from "../mappers/prisma-order-mapper";
import { PrismaRecipientMapper } from "../mappers/prisma-recipient-mapper";

describe('Prisma Orders Repository (e2e)', () => {
  let app: INestApplication;
  let orderFactory: OrderFactory;
  let recipientFactory: RecipientFactory;
  let cacheRepository: CacheRepository;
  let ordersRepository: OrdersRepository;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule, CacheModule],
      providers: [RecipientFactory, OrderFactory],
    }).compile()

    app = moduleRef.createNestApplication()

    recipientFactory = moduleRef.get(RecipientFactory)
    orderFactory = moduleRef.get(OrderFactory)
    cacheRepository = moduleRef.get(CacheRepository)
    ordersRepository = moduleRef.get(OrdersRepository)

    await app.init()
  })

  it('should cache order details', async () => {
    const recipient = await recipientFactory.makePrismaRecipient()

    const order = await orderFactory.makePrismaOrder({
      recipientId: recipient.id,
    })

    const orderId = order.id.toString()

    await ordersRepository.findDetailsById(orderId)

    const cached = await cacheRepository.get(`order:${orderId}:details`)

    if (!cached) {
      throw new Error()
    }

    expect(JSON.parse(cached)).toEqual(expect.objectContaining({
      id: orderId,
    }))
  })

  it('should return cached order details on subsequent calls', async () => {
    const recipient = await recipientFactory.makePrismaRecipient()

    const order = await orderFactory.makePrismaOrder({
      recipientId: recipient.id,
    })

    const orderId = order.id.toString()

    const orderToSet = {
      ...PrismaOrderMapper.toPrisma(order),
      title: 'Cached Order Title',
      recipient: {
        ...PrismaRecipientMapper.toPrisma(recipient),
        name: 'Cached Recipient Name',
      }
    }

    await cacheRepository.set(
      `order:${orderId}:details`,
      JSON.stringify(orderToSet)
    )

    const newOrderDetails = await ordersRepository.findDetailsById(orderId)

    expect(newOrderDetails).toEqual(expect.objectContaining({ 
      title: 'Cached Order Title',
      recipient: 'Cached Recipient Name',
    }))
  })

  it('should reset order details cache when saving the order', async () => {
    const recipient = await recipientFactory.makePrismaRecipient()

    const order = await orderFactory.makePrismaOrder({
      recipientId: recipient.id,
    })

    const orderId = order.id.toString()

    await cacheRepository.set(
      `order:${orderId}:details`,
      'empty-cached-data'
    )

    await ordersRepository.save(order)

    const cached = await cacheRepository.get(`order:${orderId}:details`)

    expect(cached).toBeNull()
  })
})