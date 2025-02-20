import { CreateRecipientUseCase } from './create-recipient';
import { InMemoryRecipientRepository } from './../../../../../../test/repositories/in-memory-recipient-repository';
import { makeRecipient } from 'test/factories/makeRecipient';
import { CpfAlreadyExistsError } from '../errors/cpf-already-exists';
let inMemoryRecipientRepository: InMemoryRecipientRepository;
let createRecipientUseCase: CreateRecipientUseCase;
describe('Create Recipient Use Case', () => {
  beforeEach(() => {
    inMemoryRecipientRepository = new InMemoryRecipientRepository();
    createRecipientUseCase = new CreateRecipientUseCase(
      inMemoryRecipientRepository,
    );
  });
  it('should successfully create a recipient', async () => {
    const newRecipient = makeRecipient();
    await createRecipientUseCase.execute({
      cpf: newRecipient.cpf,
      name: newRecipient.name,
      city: newRecipient.address.city,
      neighborhood: newRecipient.address.neighborhood,
      number: newRecipient.address.number,
      state: newRecipient.address.state,
      street: newRecipient.address.street,
      zipCode: newRecipient.address.zipCode,
      latitude: -22.932381,
      longitude: -43.173639,
      role: 'ADMIN',
    });
    expect(inMemoryRecipientRepository.recipients).toHaveLength(1);
    expect(inMemoryRecipientRepository.recipients[0].name).toBe(
      newRecipient.name,
    );
  });
  it('should throw error if recipient exists', async () => {
    const newRecipient = makeRecipient();
    await createRecipientUseCase.execute({
      cpf: newRecipient.cpf,
      name: newRecipient.name,
      city: newRecipient.address.city,
      neighborhood: newRecipient.address.neighborhood,
      number: newRecipient.address.number,
      state: newRecipient.address.state,
      street: newRecipient.address.street,
      zipCode: newRecipient.address.zipCode,
      latitude: -22.932381,
      longitude: -43.173639,
      role: 'ADMIN',
    });
    await expect(
      createRecipientUseCase.execute({
        cpf: newRecipient.cpf,
        name: newRecipient.name,
        city: newRecipient.address.city,
        neighborhood: newRecipient.address.neighborhood,
        number: newRecipient.address.number,
        state: newRecipient.address.state,
        street: newRecipient.address.street,
        zipCode: newRecipient.address.zipCode,
        latitude: -22.932381,
        longitude: -43.173639,
        role: 'ADMIN',
      }),
    ).rejects.toThrow(CpfAlreadyExistsError);
  });
});
