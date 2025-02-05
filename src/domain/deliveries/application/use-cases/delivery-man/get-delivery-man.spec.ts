import { ResourceNotFoundError } from 'src/core/errors/resource-not-found-error';
import { DeliveryMan } from '../../../enterprise/entities/delivery-man';
import { InMemoryDeliveryManRepository } from '../../../../../../test/repositories/in-memory-delivery-man-repository';
import { GetDeliveryManUseCase } from './get-delivery-man';

let iMemoryDeliveryManRepository: InMemoryDeliveryManRepository;
let getDeliveryManUseCase: GetDeliveryManUseCase;

describe('GetDeliveryMan', () => {
  beforeEach(() => {
    iMemoryDeliveryManRepository = new InMemoryDeliveryManRepository();

    getDeliveryManUseCase = new GetDeliveryManUseCase(
      iMemoryDeliveryManRepository,
    );
  });
  it('should return a delivery man', async () => {
    const deliveryMan = DeliveryMan.create({
      name: 'John Doe',
      cpf: '12345678909',
      password: '123456',
      role: 'ADMIN',
    });
    await iMemoryDeliveryManRepository.create(deliveryMan);
    const response = await getDeliveryManUseCase.execute({
      id: deliveryMan.id.toString(),
      role: 'ADMIN',
    });
    expect(response.deliveryMan).toEqual(deliveryMan);
  });
  it('should return an error if the delivery not exists', async () => {
    await expect(
      getDeliveryManUseCase.execute({
        id: '123456',
        role: 'ADMIN',
      }),
    ).rejects.toThrow(ResourceNotFoundError);
  });
});
