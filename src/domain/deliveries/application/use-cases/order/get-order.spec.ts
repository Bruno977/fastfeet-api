import { DeliveryMan } from 'src/domain/deliveries/enterprise/entities/delivery-man';
import { InMemoryOrderRepository } from './../../../../../../test/repositories/in-memory-order-repository';
import { GetOrderUseCase } from './get-order';
import { InMemoryDeliveryManRepository } from 'test/repositories/in-memory-delivery-man-repository';
import { makeOrder } from 'test/factories/makeOrder';

let getOrderUseCase: GetOrderUseCase;
let inMemoryOrderRepository: InMemoryOrderRepository;
let inMemoryDeliveryManRepository: InMemoryDeliveryManRepository;
describe('GetOrderUseCase', () => {
  beforeEach(() => {
    inMemoryOrderRepository = new InMemoryOrderRepository();
    inMemoryDeliveryManRepository = new InMemoryDeliveryManRepository();
    getOrderUseCase = new GetOrderUseCase(inMemoryOrderRepository);
  });
  it('should return a order', async () => {
    const deliveryMan = DeliveryMan.create({
      cpf: '12345678901',
      name: 'jhon doe',
      password: '123456',
    });

    await inMemoryDeliveryManRepository.create(deliveryMan);
    const newOrder = makeOrder();
    await inMemoryOrderRepository.create(newOrder);

    const order = await getOrderUseCase.execute({
      orderId: newOrder.id.toString(),
      role: 'ADMIN',
    });
    expect(order.order).toEqual(newOrder);
  });
});
