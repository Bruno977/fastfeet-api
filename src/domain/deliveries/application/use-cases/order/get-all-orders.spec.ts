import { InMemoryOrderRepository } from 'test/repositories/in-memory-order-repository';
import { GetAllOrdersUseCase } from './get-all-orders';
import { InMemoryRecipientRepository } from 'test/repositories/in-memory-recipient-repository';
import { makeOrder } from 'test/factories/makeOrder';

let iMemoryOrderRepository: InMemoryOrderRepository;
let iMemoryRecipientRepository: InMemoryRecipientRepository;
let getAllOrdersUseCase: GetAllOrdersUseCase;

describe('GetAllOrdersUseCase', () => {
  beforeEach(() => {
    iMemoryRecipientRepository = new InMemoryRecipientRepository();
    iMemoryOrderRepository = new InMemoryOrderRepository(
      iMemoryRecipientRepository,
    );

    getAllOrdersUseCase = new GetAllOrdersUseCase(iMemoryOrderRepository);
  });
  it('should return all Orders', async () => {
    await iMemoryOrderRepository.create(makeOrder());
    await iMemoryOrderRepository.create(makeOrder());
    await iMemoryOrderRepository.create(makeOrder());
    await iMemoryOrderRepository.create(makeOrder());
    await iMemoryOrderRepository.create(makeOrder());

    const { orders } = await getAllOrdersUseCase.execute({
      role: 'ADMIN',
    });

    expect(orders).toHaveLength(5);
  });
});
