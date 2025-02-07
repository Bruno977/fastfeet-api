import { InMemoryOrderRepository } from 'test/repositories/in-memory-order-repository';
import { UpdateOrderStatusUseCase } from './update-order-status';
import { makeDeliveryMan } from 'test/factories/makeDeliveryMan';
import { InMemoryDeliveryManRepository } from 'test/repositories/in-memory-delivery-man-repository';
import { makeOrder } from 'test/factories/makeOrder';
import { NotAllowedError } from 'src/core/errors/not-allowed-error';
import { InMemoryRecipientRepository } from 'test/repositories/in-memory-recipient-repository';
import { AttachmentRequiredError } from '../errors/attachment-required-error';

let updateOrderStatusUseCase: UpdateOrderStatusUseCase;
let inMemoryOrderRepository: InMemoryOrderRepository;
let inMemoryDeliveryManRepository: InMemoryDeliveryManRepository;
let inMemoryRecipientRepository: InMemoryRecipientRepository;
describe('UpdateOrderStatusUseCase', () => {
  beforeEach(() => {
    inMemoryRecipientRepository = new InMemoryRecipientRepository();
    inMemoryOrderRepository = new InMemoryOrderRepository(
      inMemoryRecipientRepository,
    );
    inMemoryDeliveryManRepository = new InMemoryDeliveryManRepository();
    updateOrderStatusUseCase = new UpdateOrderStatusUseCase(
      inMemoryOrderRepository,
      inMemoryDeliveryManRepository,
    );
  });
  it('should update order', async () => {
    const newDeliveryMan = makeDeliveryMan();
    await inMemoryDeliveryManRepository.create(newDeliveryMan);

    const newOrder = makeOrder({ deliveryManId: newDeliveryMan.id });
    await inMemoryOrderRepository.create(newOrder);

    expect(newOrder.status).toBe('NEW');

    await updateOrderStatusUseCase.execute({
      status: 'RETURNED',
      orderId: newOrder.id.toString(),
      deliveryManId: newDeliveryMan.id.toString(),
      role: 'DELIVERY_MAN',
      attachmentId: '1',
    });
    expect(newOrder.status).toBe('RETURNED');
    expect(newOrder.attachmentId?.toString()).toBe('1');
  });
  it('should not allow delivery man to update order status to AWAITING_PICKUP', async () => {
    const newDeliveryMan = makeDeliveryMan();
    await inMemoryDeliveryManRepository.create(newDeliveryMan);

    const newOrder = makeOrder({ deliveryManId: newDeliveryMan.id });
    await inMemoryOrderRepository.create(newOrder);

    expect(newOrder.status).toBe('NEW');

    await expect(
      updateOrderStatusUseCase.execute({
        status: 'AWAITING_PICKUP',
        orderId: newOrder.id.toString(),
        deliveryManId: newDeliveryMan.id.toString(),
        role: 'DELIVERY_MAN',
      }),
    ).rejects.toThrow(NotAllowedError);
  });
  it('should not allow a different delivery man to update order status to DELIVERED', async () => {
    const newDeliveryMan = makeDeliveryMan();
    await inMemoryDeliveryManRepository.create(newDeliveryMan);
    const newDeliveryMan2 = makeDeliveryMan();
    await inMemoryDeliveryManRepository.create(newDeliveryMan2);

    const newOrder = makeOrder({ deliveryManId: newDeliveryMan.id });
    await inMemoryOrderRepository.create(newOrder);
    await expect(
      updateOrderStatusUseCase.execute({
        status: 'DELIVERED',
        orderId: newOrder.id.toString(),
        deliveryManId: newDeliveryMan2.id.toString(),
        role: 'DELIVERY_MAN',
      }),
    ).rejects.toThrow(NotAllowedError);
  });
  it('should throw error if order status is DELIVERED and attachment is empty', async () => {
    const newDeliveryMan = makeDeliveryMan();
    await inMemoryDeliveryManRepository.create(newDeliveryMan);

    const newOrder = makeOrder({ deliveryManId: newDeliveryMan.id });
    await inMemoryOrderRepository.create(newOrder);

    expect(newOrder.status).toBe('NEW');

    await expect(
      updateOrderStatusUseCase.execute({
        status: 'DELIVERED',
        orderId: newOrder.id.toString(),
        deliveryManId: newDeliveryMan.id.toString(),
        role: 'DELIVERY_MAN',
      }),
    ).rejects.toThrow(AttachmentRequiredError);
  });
});
