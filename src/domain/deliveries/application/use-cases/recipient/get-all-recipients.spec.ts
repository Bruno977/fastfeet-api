import { GetAllRecipientsUseCase } from './get-all-recipients';
import { InMemoryRecipientRepository } from 'test/repositories/in-memory-recipient-repository';
import { makeRecipient } from 'test/factories/makeRecipient';

let iMemoryRecipientRepository: InMemoryRecipientRepository;
let getAllRecipientsUseCase: GetAllRecipientsUseCase;

describe('GetAllRecipientsUseCase', () => {
  beforeEach(() => {
    iMemoryRecipientRepository = new InMemoryRecipientRepository();

    getAllRecipientsUseCase = new GetAllRecipientsUseCase(
      iMemoryRecipientRepository,
    );
  });
  it('should return all Recipients', async () => {
    await iMemoryRecipientRepository.create(makeRecipient());
    await iMemoryRecipientRepository.create(makeRecipient());
    await iMemoryRecipientRepository.create(makeRecipient());
    await iMemoryRecipientRepository.create(makeRecipient());
    await iMemoryRecipientRepository.create(makeRecipient());

    const { recipients } = await getAllRecipientsUseCase.execute({
      role: 'ADMIN',
    });

    expect(recipients).toHaveLength(5);
  });
});
