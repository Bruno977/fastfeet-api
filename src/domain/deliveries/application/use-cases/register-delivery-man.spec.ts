import { InMemoryDeliveryManRepository } from './../../../../../test/repositories/in-memory-delivery-man-repository';
import { RegisterDeliveryManUseCase } from './register-delivery-man';
import { FakeHasher } from 'test/cryptography/fake-hasher';

let registerDeliveryManUseCase: RegisterDeliveryManUseCase;
let inMemoryDeliveryManRepository: InMemoryDeliveryManRepository;
let fakeHasher: FakeHasher;
describe('RegisterDeliveryManUseCase', () => {
  beforeEach(() => {
    inMemoryDeliveryManRepository = new InMemoryDeliveryManRepository();
    fakeHasher = new FakeHasher();
    registerDeliveryManUseCase = new RegisterDeliveryManUseCase(
      inMemoryDeliveryManRepository,
      fakeHasher,
    );
  });
  it('should create an user', async () => {
    const deliveryMan = {
      name: 'John Doe',
      cpf: '12345678909',
      password: '123456',
    };
    await registerDeliveryManUseCase.execute(deliveryMan);
    expect(inMemoryDeliveryManRepository.deliveryMan.length).toBe(1);
  });
  it("should hash the user's password", async () => {
    const deliveryMan = {
      name: 'John Doe',
      cpf: '12345678909',
      password: '123456',
    };
    await registerDeliveryManUseCase.execute(deliveryMan);

    const hashedPassword = await fakeHasher.hash('123456');

    expect(inMemoryDeliveryManRepository.deliveryMan[0].password).toEqual(
      hashedPassword,
    );
  });
  it('should not register an user with the same cpf', async () => {
    const deliveryMan = {
      name: 'John Doe',
      cpf: '12345678909',
      password: '123456',
    };
    await registerDeliveryManUseCase.execute(deliveryMan);
    await expect(
      registerDeliveryManUseCase.execute(deliveryMan),
    ).rejects.toThrow('CPF already in use');
  });
});
