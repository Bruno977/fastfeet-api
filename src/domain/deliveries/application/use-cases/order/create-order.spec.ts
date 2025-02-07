import { makeDeliveryMan } from 'test/factories/makeDeliveryMan';
import { InMemoryRecipientRepository } from 'test/repositories/in-memory-recipient-repository';
import { InMemoryDeliveryManRepository } from './../../../../../../test/repositories/in-memory-delivery-man-repository';
import { InMemoryOrderRepository } from 'test/repositories/in-memory-order-repository';
import { CreateOrderUseCase } from './create-order';
import { DeliveryManNotFoundError } from '../errors/delivery-man-not-found-error';
import { makeRecipient } from 'test/factories/makeRecipient';
import { RecipientNotFoundError } from '../errors/recipient-not-found-error';

let createOrderUseCase: CreateOrderUseCase;
let inMemoryDeliveryManRepository: InMemoryDeliveryManRepository;
let inMemoryRecipientRepository: InMemoryRecipientRepository;
let inMemoryOrderRepository: InMemoryOrderRepository;
describe('CreateOrderUseCase', () => {
  beforeEach(() => {
    inMemoryDeliveryManRepository = new InMemoryDeliveryManRepository();
    inMemoryRecipientRepository = new InMemoryRecipientRepository();
    inMemoryOrderRepository = new InMemoryOrderRepository(
      inMemoryRecipientRepository,
    );
    createOrderUseCase = new CreateOrderUseCase(
      inMemoryOrderRepository,
      inMemoryDeliveryManRepository,
      inMemoryRecipientRepository,
    );
  });
  it('should create a new order', async () => {
    const deliveryMan = makeDeliveryMan();
    await inMemoryDeliveryManRepository.create(deliveryMan);

    const recipient = makeRecipient();
    await inMemoryRecipientRepository.create(recipient);

    await createOrderUseCase.execute({
      description: 'Order Description',
      deliveryManId: deliveryMan.id.toString(),
      recipientId: recipient.id.toString(),
      role: 'ADMIN',
    });
    expect(inMemoryOrderRepository.order.length).toBe(1);
  });

  it('should not create an order if the delivery not exists', async () => {
    await expect(
      createOrderUseCase.execute({
        description: 'Order Description',
        deliveryManId: '123',
        recipientId: '123',
        role: 'ADMIN',
      }),
    ).rejects.toThrow(DeliveryManNotFoundError);
  });
  it('should not create an order if the recipient not exists', async () => {
    const deliveryMan = makeDeliveryMan();
    await inMemoryDeliveryManRepository.create(deliveryMan);
    await expect(
      createOrderUseCase.execute({
        description: 'Order Description',
        deliveryManId: deliveryMan.id.toString(),
        recipientId: '123',
        role: 'ADMIN',
      }),
    ).rejects.toThrow(RecipientNotFoundError);
  });
});
