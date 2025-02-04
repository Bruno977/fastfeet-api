import { CreateRecipientUseCase } from './create-recipient';
import { InMemoryRecipientRepository } from './../../../../../../test/repositories/in-memory-recipient-repository';
import { makeRecipient } from 'test/factories/makeRecipient';
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
      role: 'ADMIN',
    });
    expect(inMemoryRecipientRepository.recipients).toHaveLength(1);
    expect(inMemoryRecipientRepository.recipients[0].name).toBe(
      newRecipient.name,
    );
  });
});
