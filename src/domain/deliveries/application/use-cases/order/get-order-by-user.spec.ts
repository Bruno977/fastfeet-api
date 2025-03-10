import { InMemoryOrderRepository } from './../../../../../../test/repositories/in-memory-order-repository';
import { GetOrderByUserUseCase } from './get-order-by-user';
import { InMemoryDeliveryManRepository } from 'test/repositories/in-memory-delivery-man-repository';
import { makeOrder } from 'test/factories/makeOrder';
import { makeDeliveryMan } from 'test/factories/makeDeliveryMan';
import { DeliveryManNotFoundError } from '../errors/delivery-man-not-found-error';
import { NotAllowedError } from 'src/core/errors/not-allowed-error';
import { InMemoryRecipientRepository } from 'test/repositories/in-memory-recipient-repository';

let getOrderByUserUseCase: GetOrderByUserUseCase;
let inMemoryOrderRepository: InMemoryOrderRepository;
let inMemoryRecipientRepository: InMemoryRecipientRepository;
let inMemoryDeliveryManRepository: InMemoryDeliveryManRepository;
describe('GetOrderByUserUseCase', () => {
  beforeEach(() => {
    inMemoryRecipientRepository = new InMemoryRecipientRepository();
    inMemoryOrderRepository = new InMemoryOrderRepository(
      inMemoryRecipientRepository,
    );
    inMemoryDeliveryManRepository = new InMemoryDeliveryManRepository();
    getOrderByUserUseCase = new GetOrderByUserUseCase(
      inMemoryOrderRepository,
      inMemoryDeliveryManRepository,
    );
  });
  it('should return all orders for a specific delivery man', async () => {
    const deliveryMan = makeDeliveryMan();
    const deliveryMan2 = makeDeliveryMan();

    await inMemoryDeliveryManRepository.create(deliveryMan);
    await inMemoryDeliveryManRepository.create(deliveryMan2);
    await inMemoryOrderRepository.create(
      makeOrder({
        deliveryManId: deliveryMan.id,
      }),
    );
    await inMemoryOrderRepository.create(
      makeOrder({
        deliveryManId: deliveryMan.id,
      }),
    );
    await inMemoryOrderRepository.create(
      makeOrder({
        deliveryManId: deliveryMan.id,
      }),
    );
    await inMemoryOrderRepository.create(
      makeOrder({
        deliveryManId: deliveryMan2.id,
      }),
    );

    const order = await getOrderByUserUseCase.execute({
      deliveryManId: deliveryMan.id.toString(),
      currentUserId: deliveryMan.id.toString(),
      page: 1,
    });
    expect(order.orders).toHaveLength(3);
  });
  it('should return an error if the delivery man does not exist', async () => {
    await expect(
      getOrderByUserUseCase.execute({
        deliveryManId: '123',
        currentUserId: '123',
        page: 1,
      }),
    ).rejects.toThrow(DeliveryManNotFoundError);
  });
  it('should return an error if the current user is not allowed to access the orders', async () => {
    const deliveryMan = makeDeliveryMan();
    const deliveryMan2 = makeDeliveryMan();

    await inMemoryDeliveryManRepository.create(deliveryMan);
    await inMemoryDeliveryManRepository.create(deliveryMan2);

    await inMemoryOrderRepository.create(
      makeOrder({
        deliveryManId: deliveryMan.id,
      }),
    );
    await expect(
      getOrderByUserUseCase.execute({
        deliveryManId: deliveryMan2.id.toString(),
        currentUserId: deliveryMan.id.toString(),
        page: 1,
      }),
    ).rejects.toThrow(NotAllowedError);
  });
  it('should return all Orders by user paginated', async () => {
    const deliveryMan = makeDeliveryMan();
    await inMemoryDeliveryManRepository.create(deliveryMan);
    for (let i = 1; i <= 22; i++) {
      await inMemoryOrderRepository.create(
        makeOrder({
          deliveryManId: deliveryMan.id,
        }),
      );
    }

    const { orders } = await getOrderByUserUseCase.execute({
      deliveryManId: deliveryMan.id.toString(),
      currentUserId: deliveryMan.id.toString(),
      page: 2,
    });

    expect(orders).toHaveLength(2);
  });
});
