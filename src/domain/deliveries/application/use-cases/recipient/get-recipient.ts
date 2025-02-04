import { RoleProps } from 'src/core/types/role';
import { RecipientRepository } from '../../repositories/recipient-repository';
import { ResourceNotFoundError } from 'src/core/errors/resource-not-found-error';
import { AuthorizationService } from 'src/core/services/authorization-service';

interface GetRecipientUseCaseRequest {
  recipientId: string;
  role: RoleProps;
}

export class GetRecipientUseCase {
  constructor(private recipientRepository: RecipientRepository) {}
  async execute({ recipientId, role }: GetRecipientUseCaseRequest) {
    AuthorizationService.verifyRole({ role, allowedRole: 'ADMIN' });
    const recipient = await this.recipientRepository.findById(recipientId);
    if (!recipient) {
      throw new ResourceNotFoundError();
    }
    return {
      recipient,
    };
  }
}
