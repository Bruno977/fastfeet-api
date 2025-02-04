import { InMemoryOrderRepository } from 'test/repositories/in-memory-order-repository';
import { DeleteOrderUseCase } from './delete-order';
import { makeOrder } from 'test/factories/makeOrder';
import { ResourceNotFoundError } from 'src/core/errors/resource-not-found-error';

let deleteOrderUseCase: DeleteOrderUseCase;
let inMemoryOrderRepository: InMemoryOrderRepository;

describe('DeleteOrderUseCase', () => {
  beforeEach(() => {
    inMemoryOrderRepository = new InMemoryOrderRepository();
    deleteOrderUseCase = new DeleteOrderUseCase(inMemoryOrderRepository);
  });
  it('should delete an order', async () => {
    const newOrder = makeOrder();
    await inMemoryOrderRepository.create(newOrder);

    expect(inMemoryOrderRepository.order.length).toBe(1);

    await deleteOrderUseCase.execute({
      id: newOrder.id.toString(),
      role: 'ADMIN',
    });
    expect(inMemoryOrderRepository.order.length).toBe(0);
  });

  it('should not delete an user if the order not exists', async () => {
    await expect(
      deleteOrderUseCase.execute({
        id: '123',
        role: 'ADMIN',
      }),
    ).rejects.toThrow(ResourceNotFoundError);
  });
});
