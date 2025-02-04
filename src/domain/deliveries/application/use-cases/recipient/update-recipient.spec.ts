import { InMemoryRecipientRepository } from 'test/repositories/in-memory-recipient-repository';
import { UpdateRecipientUseCase } from './update-recipient';
import { makeRecipient } from 'test/factories/makeRecipient';
import { ResourceNotFoundError } from 'src/core/errors/resource-not-found-error';

let updateRecipientUseCase: UpdateRecipientUseCase;
let inMemoryRecipientRepository: InMemoryRecipientRepository;
describe('UpdateRecipientUseCase', () => {
  beforeEach(() => {
    inMemoryRecipientRepository = new InMemoryRecipientRepository();
    updateRecipientUseCase = new UpdateRecipientUseCase(
      inMemoryRecipientRepository,
    );
  });
  it('should update a recipient', async () => {
    const newRecipient = makeRecipient();
    await inMemoryRecipientRepository.create(newRecipient);

    await updateRecipientUseCase.execute({
      recipientId: newRecipient.id.toString(),
      name: 'John Doe',
      cpf: '123.456.789-00',
      street: 'Fake Street',
      number: '123',
      neighborhood: 'Fake Neighborhood',
      city: 'Faketown',
      state: 'FS',
      zipCode: '12345-678',
      role: 'ADMIN',
    });
    const updatedRecipient = await inMemoryRecipientRepository.findById(
      newRecipient.id.toString(),
    );
    expect(updatedRecipient?.name).toBe('John Doe');
  });

  it('should throw an error if the recipient does not exist', async () => {
    await expect(
      updateRecipientUseCase.execute({
        name: 'John Doe',
        recipientId: '123',
        cpf: '123.456.789-00',
        street: 'Fake Street',
        number: '123',
        neighborhood: 'Fake Neighborhood',
        city: 'Faketown',
        state: 'FS',
        zipCode: '12345-678',
        role: 'ADMIN',
      }),
    ).rejects.toThrow(ResourceNotFoundError);
  });
});
