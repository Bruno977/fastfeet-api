import { InMemoryDeliveryManRepository } from './../../../../../../test/repositories/in-memory-delivery-man-repository';
import { InMemoryRecipientRepository } from './../../../../../../test/repositories/in-memory-recipient-repository';
import { InMemoryOrderRepository } from 'test/repositories/in-memory-order-repository';
import { FindManyNearbyUseCase } from './find-many-nearby';
import { makeOrder } from 'test/factories/makeOrder';
import { makeRecipient } from 'test/factories/makeRecipient';
import { makeDeliveryMan } from 'test/factories/makeDeliveryMan';

let findManyNearbyUseCase: FindManyNearbyUseCase;
let inMemoryRecipientRepository: InMemoryRecipientRepository;
let inMemoryDeliveryManRepository: InMemoryDeliveryManRepository;
let orderRepository: InMemoryOrderRepository;

describe('Fetch Nearby Order Use Case', () => {
  beforeEach(async () => {
    inMemoryRecipientRepository = new InMemoryRecipientRepository();
    inMemoryDeliveryManRepository = new InMemoryDeliveryManRepository();
    orderRepository = new InMemoryOrderRepository(inMemoryRecipientRepository);
    findManyNearbyUseCase = new FindManyNearbyUseCase(
      orderRepository,
      inMemoryDeliveryManRepository,
    );
  });

  it('should be able to fetch nearby order', async () => {
    const newDeliveryMan = makeDeliveryMan();
    await inMemoryDeliveryManRepository.create(newDeliveryMan);

    const recipient1 = makeRecipient();
    const recipient2 = makeRecipient();
    recipient1.address.latitude = -22.92445;
    recipient1.address.longitude = -43.171343;

    recipient2.address.latitude = -23.000143;
    recipient2.address.longitude = -43.269481;

    await inMemoryRecipientRepository.create(recipient1);
    await inMemoryRecipientRepository.create(recipient2);

    await orderRepository.create(
      makeOrder({
        deliveryManId: newDeliveryMan.id,
        recipientId: recipient1.id,
        description: 'description',
      }),
    );
    await orderRepository.create(
      makeOrder({
        deliveryManId: newDeliveryMan.id,
        recipientId: recipient1.id,
        description: 'description 2',
      }),
    );
    await orderRepository.create(
      makeOrder({
        deliveryManId: newDeliveryMan.id,
        recipientId: recipient2.id,
      }),
    );

    const { order } = await findManyNearbyUseCase.execute({
      deliveryManLatitude: -22.932381,
      deliveryManLongitude: -43.173639,
      deliveryManId: newDeliveryMan.id.toString(),
    });
    expect(order).toHaveLength(2);
    expect(order).toEqual([
      expect.objectContaining({ description: 'description' }),
      expect.objectContaining({ description: 'description 2' }),
    ]);
  });
});
