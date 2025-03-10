import { RoleProps } from 'src/core/types/role';
import { Authorization } from '../../auth/authorization';
import { NotAllowedError } from 'src/core/errors/not-allowed-error';
import { RecipientRepository } from '../../repositories/recipient-repository';
import { Injectable } from '@nestjs/common';

interface GetAllRecipientsRequest {
  role: RoleProps;
  page: number;
}
@Injectable()
export class GetAllRecipientsUseCase {
  constructor(private recipientRepository: RecipientRepository) {}
  async execute({ role, page }: GetAllRecipientsRequest) {
    const isAdmin = Authorization.hasPermission(role, 'get-all-recipients');
    if (!isAdmin) {
      throw new NotAllowedError();
    }

    const recipients = await this.recipientRepository.findMany({ page });
    return { recipients };
  }
}
