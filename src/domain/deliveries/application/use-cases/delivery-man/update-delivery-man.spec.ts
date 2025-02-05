import { InMemoryDeliveryManRepository } from '../../../../../../test/repositories/in-memory-delivery-man-repository';
import { UpdateDeliveryManUseCase } from './update-delivery-man';
import { FakeHasher } from 'test/cryptography/fake-hasher';
import { DeliveryMan } from '../../../enterprise/entities/delivery-man';

let updateDeliveryManUseCase: UpdateDeliveryManUseCase;
let inMemoryDeliveryManRepository: InMemoryDeliveryManRepository;
let fakeHasher: FakeHasher;
describe('UpdateDeliveryManUseCase', () => {
  beforeEach(() => {
    inMemoryDeliveryManRepository = new InMemoryDeliveryManRepository();
    fakeHasher = new FakeHasher();
    updateDeliveryManUseCase = new UpdateDeliveryManUseCase(
      inMemoryDeliveryManRepository,
      fakeHasher,
    );
  });
  it('should update an user', async () => {
    const deliveryMan = DeliveryMan.create({
      name: 'John Doe',
      cpf: '12345678909',
      password: '123456',
      role: 'ADMIN',
    });
    await inMemoryDeliveryManRepository.create(deliveryMan);

    await updateDeliveryManUseCase.execute({
      name: 'John Doe 2',
      password: '12345689',
      role: 'ADMIN',
      id: deliveryMan.id.toString(),
    });
    expect(inMemoryDeliveryManRepository.deliveryMan).toEqual([
      expect.objectContaining({
        name: 'John Doe 2',
        password: '12345689-hashed',
      }),
    ]);
  });
});
