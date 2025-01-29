import { InMemoryOrderRepository } from 'test/repositories/in-memory-order-repository';
import { DeleteOrderUseCase } from './delete-order';
import { makeOrder } from 'test/factories/makeOrder';
import { NotAllowedError } from 'src/core/errors/not-allowed-error';
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
  it("should not register an user if it's not an admin", async () => {
    await expect(
      deleteOrderUseCase.execute({
        id: '123',
        role: 'DELIVERY_MAN',
      }),
    ).rejects.toThrow(NotAllowedError);
  });
  it('should not register an user if the delivery not exists', async () => {
    await expect(
      deleteOrderUseCase.execute({
        id: '123',
        role: 'ADMIN',
      }),
    ).rejects.toThrow(ResourceNotFoundError);
  });
});
