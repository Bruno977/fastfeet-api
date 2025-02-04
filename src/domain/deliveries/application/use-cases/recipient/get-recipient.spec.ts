import { InMemoryRecipientRepository } from './../../../../../../test/repositories/in-memory-recipient-repository';
import { GetRecipientUseCase } from './get-recipient';
import { makeRecipient } from 'test/factories/makeRecipient';

let getRecipientUseCase: GetRecipientUseCase;
let inMemoryRecipientRepository: InMemoryRecipientRepository;
describe('GetRecipientUseCase', () => {
  beforeEach(() => {
    inMemoryRecipientRepository = new InMemoryRecipientRepository();
    getRecipientUseCase = new GetRecipientUseCase(inMemoryRecipientRepository);
  });
  it('should return a recipient', async () => {
    const newRecipient = makeRecipient();
    await inMemoryRecipientRepository.create(newRecipient);

    const recipient = await getRecipientUseCase.execute({
      recipientId: newRecipient.id.toString(),
      role: 'ADMIN',
    });
    expect(recipient.recipient).toEqual(newRecipient);
  });
});
