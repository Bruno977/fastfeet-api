import { RoleProps } from 'src/core/types/role';
import { RecipientRepository } from '../../repositories/recipient-repository';
import { ResourceNotFoundError } from 'src/core/errors/resource-not-found-error';
import { Authorization } from '../../auth/authorization';
import { NotAllowedError } from 'src/core/errors/not-allowed-error';

interface DeleteRecipientRequest {
  id: string;
  role: RoleProps;
}

export class DeleteRecipientUseCase {
  constructor(private recipientRepository: RecipientRepository) {}
  async execute({ id, role }: DeleteRecipientRequest) {
    const isAdmin = Authorization.hasPermission(role, 'delete-recipient');
    if (!isAdmin) {
      throw new NotAllowedError();
    }
    const recipient = await this.recipientRepository.findById(id);
    if (!recipient) {
      throw new ResourceNotFoundError();
    }

    await this.recipientRepository.delete(id);
  }
}
