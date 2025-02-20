import { RoleProps } from 'src/core/types/role';
import { RecipientRepository } from '../../repositories/recipient-repository';
import { ResourceNotFoundError } from 'src/core/errors/resource-not-found-error';
import { Authorization } from '../../auth/authorization';
import { NotAllowedError } from 'src/core/errors/not-allowed-error';
import { Injectable } from '@nestjs/common';

interface GetRecipientUseCaseRequest {
  recipientId: string;
  role: RoleProps;
}
@Injectable()
export class GetRecipientUseCase {
  constructor(private recipientRepository: RecipientRepository) {}
  async execute({ recipientId, role }: GetRecipientUseCaseRequest) {
    const isAdmin = Authorization.hasPermission(role, 'get-recipient');
    if (!isAdmin) {
      throw new NotAllowedError();
    }
    const recipient = await this.recipientRepository.findById(recipientId);
    if (!recipient) {
      throw new ResourceNotFoundError();
    }
    return {
      recipient,
    };
  }
}
