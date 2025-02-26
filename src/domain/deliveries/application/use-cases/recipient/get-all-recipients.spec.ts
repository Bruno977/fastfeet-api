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
      page: 1,
    });

    expect(recipients).toHaveLength(5);
  });
  it('should return all Recipients paginated', async () => {
    for (let i = 1; i <= 22; i++) {
      await iMemoryRecipientRepository.create(makeRecipient());
    }

    const { recipients } = await getAllRecipientsUseCase.execute({
      role: 'ADMIN',
      page: 2,
    });

    expect(recipients).toHaveLength(2);
  });
});
