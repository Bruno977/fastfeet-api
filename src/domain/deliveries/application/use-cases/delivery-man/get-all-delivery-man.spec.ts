import { InMemoryDeliveryManRepository } from '../../../../../../test/repositories/in-memory-delivery-man-repository';
import { GetAllDeliveryMenUseCase } from './get-all-delivery-man';
import { makeDeliveryMan } from 'test/factories/makeDeliveryMan';

let iMemoryDeliveryManRepository: InMemoryDeliveryManRepository;
let getAllDeliveryMenUseCase: GetAllDeliveryMenUseCase;

describe('GetAllDeliveryMen', () => {
  beforeEach(() => {
    iMemoryDeliveryManRepository = new InMemoryDeliveryManRepository();

    getAllDeliveryMenUseCase = new GetAllDeliveryMenUseCase(
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
