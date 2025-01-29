import { InMemoryDeliveryManRepository } from 'test/repositories/in-memory-delivery-man-repository';
import { InMemoryOrderRepository } from 'test/repositories/in-memory-order-repository';
import { UpdateOrderUseCase } from './update-order';
import { NotAllowedError } from 'src/core/errors/not-allowed-error';
import { makeOrder } from 'test/factories/makeOrder';
import { makeDeliveryMan } from 'test/factories/makeDeliveryMan';
import { ResourceNotFoundError } from 'src/core/errors/resource-not-found-error';

let updateOrderUseCase: UpdateOrderUseCase;
let inMemoryOrderRepository: InMemoryOrderRepository;
let inMemoryDeliveryManRepository: InMemoryDeliveryManRepository;
describe('UpdateOrderUseCase', () => {
  beforeEach(() => {
    inMemoryOrderRepository = new InMemoryOrderRepository();
    inMemoryDeliveryManRepository = new InMemoryDeliveryManRepository();
    updateOrderUseCase = new UpdateOrderUseCase(
      inMemoryOrderRepository,
      inMemoryDeliveryManRepository,
    );
  });
  it('should update a order', async () => {
    const newDeliveryMan = makeDeliveryMan();
    await inMemoryDeliveryManRepository.create(newDeliveryMan);

    const newOrder = makeOrder({ deliveryManId: newDeliveryMan.id });
    await inMemoryOrderRepository.create(newOrder);

    await updateOrderUseCase.execute({
      status: 'DELIVERED',
      description: 'description',
      orderId: newOrder.id.toString(),
      deliveryManId: newDeliveryMan.id.toString(),
      role: 'ADMIN',
    });
  });
  it("should not register an user if it's not an admin", async () => {
    await expect(
      updateOrderUseCase.execute({
        status: 'DELIVERED',
        description: 'description',
        orderId: '123',
        deliveryManId: '123',
        role: 'DELIVERY_MAN',
      }),
    ).rejects.toThrow(NotAllowedError);
  });

  it('should throw an error if the order does not exist', async () => {
    await expect(
      updateOrderUseCase.execute({
        status: 'DELIVERED',
        description: 'description',
        orderId: '123',
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
        orderId: '123',
        deliveryManId: '123',
        role: 'ADMIN',
      }),
    ).rejects.toThrow(ResourceNotFoundError);
  });
});
