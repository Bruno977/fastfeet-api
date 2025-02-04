import { InMemoryRecipientRepository } from 'test/repositories/in-memory-recipient-repository';
import { DeleteRecipientUseCase } from './delete-recipient';
import { makeRecipient } from 'test/factories/makeRecipient';
import { ResourceNotFoundError } from 'src/core/errors/resource-not-found-error';

let deleteRecipientUseCase: DeleteRecipientUseCase;
let inMemoryRecipientRepository: InMemoryRecipientRepository;

describe('DeleteRecipientUseCase', () => {
  beforeEach(() => {
    inMemoryRecipientRepository = new InMemoryRecipientRepository();
    deleteRecipientUseCase = new DeleteRecipientUseCase(
      inMemoryRecipientRepository,
    );
  });
  it('should delete an recipient', async () => {
    const newRecipient = makeRecipient();
    await inMemoryRecipientRepository.create(newRecipient);

    expect(inMemoryRecipientRepository.recipients.length).toBe(1);

    await deleteRecipientUseCase.execute({
      id: newRecipient.id.toString(),
      role: 'ADMIN',
    });
    expect(inMemoryRecipientRepository.recipients.length).toBe(0);
  });
  it('should not delete an recipient if not exists', async () => {
    await expect(
      deleteRecipientUseCase.execute({
        id: '123',
        role: 'ADMIN',
      }),
    ).rejects.toThrow(ResourceNotFoundError);
  });
});
