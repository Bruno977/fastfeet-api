import { makeDeliveryMan } from 'test/factories/makeDeliveryMan';
import { InMemoryDeliveryManRepository } from './../../../../../../test/repositories/in-memory-delivery-man-repository';
import { AuthenticateDeliveryManUseCase } from './authenticate-delivery-man';
import { FakeEncrypter } from 'test/cryptography/fake-encrypter';
import { FakeHasher } from 'test/cryptography/fake-hasher';
import { WrongCredentialsError } from '../errors/wrong-credentials-error';

let authenticateDeliveryManUseCase: AuthenticateDeliveryManUseCase;
let inMemoryDeliveryManRepository: InMemoryDeliveryManRepository;
let fakeHasher: FakeHasher;
let fakeEncrypter: FakeEncrypter;
describe('AuthenticateDeliveryManUseCase', () => {
  beforeEach(() => {
    inMemoryDeliveryManRepository = new InMemoryDeliveryManRepository();
    fakeHasher = new FakeHasher();
    fakeEncrypter = new FakeEncrypter();
    authenticateDeliveryManUseCase = new AuthenticateDeliveryManUseCase(
      inMemoryDeliveryManRepository,
      fakeHasher,
      fakeEncrypter,
    );
  });
  it('should authenticate user', async () => {
    const newDeliveryMan = makeDeliveryMan({
      password: await fakeHasher.hash('123456'),
    });
    await inMemoryDeliveryManRepository.create(newDeliveryMan);
    const accessToken = await authenticateDeliveryManUseCase.execute({
      cpf: newDeliveryMan.cpf,
      password: '123456',
    });
    expect(accessToken).toHaveProperty('accessToken');
    expect(typeof accessToken.accessToken).toBe('string');
  });
  it('should throw an error if delivery man does not exists', async () => {
    await expect(
      authenticateDeliveryManUseCase.execute({
        cpf: '123',
        password: '123456',
      }),
    ).rejects.toThrow(WrongCredentialsError);
  });
  it('should throw an error if wrong credentials', async () => {
    const newDeliveryMan = makeDeliveryMan({
      password: await fakeHasher.hash('123456'),
    });
    await inMemoryDeliveryManRepository.create(newDeliveryMan);
    await expect(
      authenticateDeliveryManUseCase.execute({
        cpf: '123',
        password: '1234567',
      }),
    ).rejects.toThrow(WrongCredentialsError);
  });
});
