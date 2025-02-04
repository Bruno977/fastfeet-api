import { InMemoryOrderRepository } from './../../../../../../test/repositories/in-memory-order-repository';
import { GetOrderByUserUseCase } from './get-order-by-user';
import { InMemoryDeliveryManRepository } from 'test/repositories/in-memory-delivery-man-repository';
import { makeOrder } from 'test/factories/makeOrder';
import { makeDeliveryMan } from 'test/factories/makeDeliveryMan';
import { DeliveryManNotFoundError } from '../errors/recipient-not-found-error';
import { NotAllowedError } from 'src/core/errors/not-allowed-error';

let getOrderByUserUseCase: GetOrderByUserUseCase;
let inMemoryOrderRepository: InMemoryOrderRepository;
let inMemoryDeliveryManRepository: InMemoryDeliveryManRepository;
describe('GetOrderByUserUseCase', () => {
  beforeEach(() => {
    inMemoryOrderRepository = new InMemoryOrderRepository();
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
    });
    expect(order.orders).toHaveLength(3);
  });
  it('should return an error if the delivery man does not exist', async () => {
    await expect(
      getOrderByUserUseCase.execute({
        deliveryManId: '123',
        currentUserId: '123',
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
      }),
    ).rejects.toThrow(NotAllowedError);
  });
});
