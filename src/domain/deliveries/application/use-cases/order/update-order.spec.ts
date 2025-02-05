import { InMemoryDeliveryManRepository } from 'test/repositories/in-memory-delivery-man-repository';
import { InMemoryOrderRepository } from 'test/repositories/in-memory-order-repository';
import { UpdateOrderUseCase } from './update-order';
import { makeOrder } from 'test/factories/makeOrder';
import { makeDeliveryMan } from 'test/factories/makeDeliveryMan';
import { ResourceNotFoundError } from 'src/core/errors/resource-not-found-error';
import { InMemoryRecipientRepository } from 'test/repositories/in-memory-recipient-repository';
import { makeRecipient } from 'test/factories/makeRecipient';
import { RecipientNotFoundError } from '../errors/recipient-not-found-error';

let updateOrderUseCase: UpdateOrderUseCase;
let inMemoryOrderRepository: InMemoryOrderRepository;
let inMemoryRecipientRepository: InMemoryRecipientRepository;
let inMemoryDeliveryManRepository: InMemoryDeliveryManRepository;
describe('UpdateOrderUseCase', () => {
  beforeEach(() => {
    inMemoryOrderRepository = new InMemoryOrderRepository();
    inMemoryDeliveryManRepository = new InMemoryDeliveryManRepository();
    inMemoryRecipientRepository = new InMemoryRecipientRepository();
    updateOrderUseCase = new UpdateOrderUseCase(
      inMemoryOrderRepository,
      inMemoryDeliveryManRepository,
      inMemoryRecipientRepository,
    );
  });
  it('should update a order', async () => {
    const newDeliveryMan = makeDeliveryMan();
    await inMemoryDeliveryManRepository.create(newDeliveryMan);

    const newOrder = makeOrder({ deliveryManId: newDeliveryMan.id });
    await inMemoryOrderRepository.create(newOrder);

    const newRecipient = makeRecipient();
    await inMemoryRecipientRepository.create(newRecipient);

    await updateOrderUseCase.execute({
      status: 'DELIVERED',
      description: 'description',
      orderId: newOrder.id.toString(),
      deliveryManId: newDeliveryMan.id.toString(),
      recipientId: newRecipient.id.toString(),
      role: 'ADMIN',
    });
  });

  it('should throw an error if the order does not exist', async () => {
    await expect(
      updateOrderUseCase.execute({
        status: 'DELIVERED',
        description: 'description',
        orderId: '123',
        recipientId: '123',
        deliveryManId: '123',
        role: 'ADMIN',
      }),
    ).rejects.toThrow(ResourceNotFoundError);
  });
  it('should throw an error if delivery man does not exist', async () => {
    const newOrder = makeOrder();
    await inMemoryOrderRepository.create(newOrder);
    await expect(
      updateOrderUseCase.execute({
        status: 'DELIVERED',
        description: 'description',
        recipientId: '123',
        orderId: '123',
        deliveryManId: '123',
        role: 'ADMIN',
      }),
    ).rejects.toThrow(ResourceNotFoundError);
  });
  it('should throw an error if the recipient does not exist', async () => {
    const newDeliveryMan = makeDeliveryMan();
    await inMemoryDeliveryManRepository.create(newDeliveryMan);

    const newOrder = makeOrder({ deliveryManId: newDeliveryMan.id });
    await inMemoryOrderRepository.create(newOrder);
    await expect(
      updateOrderUseCase.execute({
        status: 'DELIVERED',
        description: 'description',
        orderId: newOrder.id.toString(),
        recipientId: '123',
        deliveryManId: newDeliveryMan.id.toString(),
        role: 'ADMIN',
      }),
    ).rejects.toThrow(RecipientNotFoundError);
  });
});
