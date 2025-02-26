import { InMemoryDeliveryManRepository } from '../../../../../../test/repositories/in-memory-delivery-man-repository';
import { GetAllDeliveryMen } from './get-all-delivery-man';
import { makeDeliveryMan } from 'test/factories/makeDeliveryMan';

let iMemoryDeliveryManRepository: InMemoryDeliveryManRepository;
let getAllDeliveryMenUseCase: GetAllDeliveryMen;

describe('GetAllDeliveryMen', () => {
  beforeEach(() => {
    iMemoryDeliveryManRepository = new InMemoryDeliveryManRepository();

    getAllDeliveryMenUseCase = new GetAllDeliveryMen(
      iMemoryDeliveryManRepository,
    );
  });
  it('should return all delivery men', async () => {
    await iMemoryDeliveryManRepository.create(makeDeliveryMan());
    await iMemoryDeliveryManRepository.create(makeDeliveryMan());
    await iMemoryDeliveryManRepository.create(makeDeliveryMan());
    await iMemoryDeliveryManRepository.create(makeDeliveryMan());
    await iMemoryDeliveryManRepository.create(makeDeliveryMan());

    const { deliveryMen } = await getAllDeliveryMenUseCase.execute({
      role: 'ADMIN',
    });

    expect(deliveryMen).toHaveLength(5);
  });
});
