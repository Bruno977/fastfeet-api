import { NotAllowedError } from 'src/core/errors/not-allowed-error';
import { InMemoryDeliveryManRepository } from '../../../../../../test/repositories/in-memory-delivery-man-repository';
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
    await registerDeliveryManUseCase.execute({
      name: 'John Doe',
      cpf: '12345678909',
      password: '123456',
      role: 'ADMIN',
    });
    expect(inMemoryDeliveryManRepository.deliveryMan.length).toBe(1);
  });
  it("should hash the user's password", async () => {
    await registerDeliveryManUseCase.execute({
      name: 'John Doe',
      cpf: '12345678909',
      password: '123456',
      role: 'ADMIN',
    });

    const hashedPassword = await fakeHasher.hash('123456');

    expect(inMemoryDeliveryManRepository.deliveryMan[0].password).toEqual(
      hashedPassword,
    );
  });
  it('should not register an user with the same cpf', async () => {
    await registerDeliveryManUseCase.execute({
      name: 'John Doe',
      cpf: '12345678909',
      password: '123456',
      role: 'ADMIN',
    });
    await expect(
      registerDeliveryManUseCase.execute({
        name: 'John Doe',
        cpf: '12345678909',
        password: '123456',
        role: 'ADMIN',
      }),
    ).rejects.toThrow('CPF already in use');
  });
  it("should not register an user if it's not an admin", async () => {
    await expect(
      registerDeliveryManUseCase.execute({
        name: 'John Doe',
        cpf: '12345678909',
        password: '123456',
        role: 'DELIVERY_MAN',
      }),
    ).rejects.toThrow(NotAllowedError);
  });
});
