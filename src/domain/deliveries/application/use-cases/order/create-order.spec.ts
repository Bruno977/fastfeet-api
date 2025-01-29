import { InMemoryDeliveryManRepository } from './../../../../../../test/repositories/in-memory-delivery-man-repository';
import { InMemoryOrderRepository } from 'test/repositories/in-memory-order-repository';
import { CreateOrderUseCase } from './create-order';
import { DeliveryMan } from 'src/domain/deliveries/enterprise/entities/delivery-man';
import { NotAllowedError } from 'src/core/errors/not-allowed-error';
import { DeliveryManNotFoundError } from '../errors/delivery-man-not-found-error';

let createOrderUseCase: CreateOrderUseCase;
let inMemoryDeliveryManRepository: InMemoryDeliveryManRepository;
let inMemoryOrderRepository: InMemoryOrderRepository;
describe('CreateOrderUseCase', () => {
  beforeEach(() => {
    inMemoryOrderRepository = new InMemoryOrderRepository();
    inMemoryDeliveryManRepository = new InMemoryDeliveryManRepository();
    createOrderUseCase = new CreateOrderUseCase(
      inMemoryOrderRepository,
      inMemoryDeliveryManRepository,
    );
  });
  it('should create a new order', async () => {
    const deliveryMan = DeliveryMan.create({
      cpf: '12345678901',
      name: 'jhon doe',
      password: '123456',
    });
    await inMemoryDeliveryManRepository.create(deliveryMan);
    await createOrderUseCase.execute({
      description: 'Order Description',
      deliveryManId: deliveryMan.id.toString(),
      role: 'ADMIN',
    });
    expect(inMemoryOrderRepository.order.length).toBe(1);
  });
  it("should not register an user if it's not an admin", async () => {
    await expect(
      createOrderUseCase.execute({
        description: 'Order Description',
        deliveryManId: '123',
        role: 'DELIVERY_MAN',
      }),
    ).rejects.toThrow(NotAllowedError);
  });
  it('should not register an user if the delivery not exists', async () => {
    await expect(
      createOrderUseCase.execute({
        description: 'Order Description',
        deliveryManId: '123',
        role: 'ADMIN',
      }),
    ).rejects.toThrow(DeliveryManNotFoundError);
  });
});
