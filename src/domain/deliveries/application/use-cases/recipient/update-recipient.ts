import { RoleProps } from 'src/core/types/role';
import { RecipientRepository } from '../../repositories/recipient-repository';
import { ResourceNotFoundError } from 'src/core/errors/resource-not-found-error';
import { AuthorizationService } from 'src/core/services/authorization-service';

interface UpdateRecipientUseCaseRequest {
  recipientId: string;
  name: string;
  cpf: string;
  street: string;
  number: string;
  neighborhood: string;
  city: string;
  state: string;
  zipCode: string;
  role: RoleProps;
}

export class UpdateRecipientUseCase {
  constructor(private recipientRepository: RecipientRepository) {}
  async execute({
    recipientId,
    name,
    cpf,
    street,
    number,
    neighborhood,
    city,
    state,
    zipCode,
    role,
  }: UpdateRecipientUseCaseRequest) {
    AuthorizationService.verifyRole({ role, allowedRole: 'ADMIN' });

    const recipient = await this.recipientRepository.findById(recipientId);
    if (!recipient) {
      throw new ResourceNotFoundError();
    }
    recipient.name = name;
    recipient.cpf = cpf;
    recipient.address.street = street;
    recipient.address.number = number;
    recipient.address.neighborhood = neighborhood;
    recipient.address.city = city;
    recipient.address.state = state;
    recipient.address.zipCode = zipCode;

    await this.recipientRepository.update(recipient);
  }
}
