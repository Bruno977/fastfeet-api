import { RoleProps } from 'src/core/types/role';
import { RecipientRepository } from '../../repositories/recipient-repository';
import { ResourceNotFoundError } from 'src/core/errors/resource-not-found-error';
import { AuthorizationService } from 'src/core/services/authorization-service';

interface DeleteRecipientRequest {
  id: string;
  role: RoleProps;
}

export class DeleteRecipientUseCase {
  constructor(private recipientRepository: RecipientRepository) {}
  async execute({ id, role }: DeleteRecipientRequest) {
    AuthorizationService.verifyRole({ role, allowedRole: 'ADMIN' });
    const recipient = await this.recipientRepository.findById(id);
    if (!recipient) {
      throw new ResourceNotFoundError();
    }

    await this.recipientRepository.delete(id);
  }
}
