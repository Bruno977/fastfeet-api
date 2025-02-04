import { InMemoryOrderRepository } from 'test/repositories/in-memory-order-repository';
import { UpdateOrderStatusUseCase } from './update-order-status';
import { makeDeliveryMan } from 'test/factories/makeDeliveryMan';
import { InMemoryDeliveryManRepository } from 'test/repositories/in-memory-delivery-man-repository';
import { makeOrder } from 'test/factories/makeOrder';
import { NotAllowedError } from 'src/core/errors/not-allowed-error';
let updateOrderStatusUseCase: UpdateOrderStatusUseCase;
let inMemoryOrderRepository: InMemoryOrderRepository;
let inMemoryDeliveryManRepository: InMemoryDeliveryManRepository;
describe('UpdateOrderStatusUseCase', () => {
  beforeEach(() => {
    inMemoryOrderRepository = new InMemoryOrderRepository();
    inMemoryDeliveryManRepository = new InMemoryDeliveryManRepository();
    updateOrderStatusUseCase = new UpdateOrderStatusUseCase(
      inMemoryOrderRepository,
      inMemoryDeliveryManRepository,
    );
  });
  it('should update order status', async () => {
    const newDeliveryMan = makeDeliveryMan();
    await inMemoryDeliveryManRepository.create(newDeliveryMan);

    const newOrder = makeOrder({ deliveryManId: newDeliveryMan.id });
    await inMemoryOrderRepository.create(newOrder);

    expect(newOrder.status).toBe('NEW');

    await updateOrderStatusUseCase.execute({
      status: 'DELIVERED',
      orderId: newOrder.id.toString(),
      deliveryManId: newDeliveryMan.id.toString(),
      role: 'DELIVERY_MAN',
    });
    expect(newOrder.status).toBe('DELIVERED');
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
});
