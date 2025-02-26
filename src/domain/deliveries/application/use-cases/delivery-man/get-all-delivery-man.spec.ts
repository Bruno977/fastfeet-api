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
      page: 1,
    });

    expect(deliveryMen).toHaveLength(5);
  });
  it('should return all delivery men paginated', async () => {
    for (let i = 1; i <= 22; i++) {
      await iMemoryDeliveryManRepository.create(makeDeliveryMan());
    }

    const { deliveryMen } = await getAllDeliveryMenUseCase.execute({
      role: 'ADMIN',
      page: 2,
    });

    expect(deliveryMen).toHaveLength(2);
  });
});
