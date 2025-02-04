import { DeliveryMan } from '../../../enterprise/entities/delivery-man';
import { InMemoryDeliveryManRepository } from '../../../../../../test/repositories/in-memory-delivery-man-repository';
import { DeleteDeliveryManUseCase } from './delete-delivery-man';

let deleteDeliveryManUseCase: DeleteDeliveryManUseCase;
let inMemoryDeliveryManRepository: InMemoryDeliveryManRepository;
describe('DeleteDeliveryManUseCase', () => {
  beforeEach(() => {
    inMemoryDeliveryManRepository = new InMemoryDeliveryManRepository();
    deleteDeliveryManUseCase = new DeleteDeliveryManUseCase(
      inMemoryDeliveryManRepository,
    );
  });
  it('should delete a delivery man', async () => {
    const deliveryMan = DeliveryMan.create({
      name: 'John Doe',
      cpf: '12345678909',
      password: '123456',
    });
    await inMemoryDeliveryManRepository.create(deliveryMan);
    expect(inMemoryDeliveryManRepository.deliveryMan).toHaveLength(1);

    await deleteDeliveryManUseCase.execute({
      id: deliveryMan.id.toString(),
      role: 'ADMIN',
    });
  });
});
