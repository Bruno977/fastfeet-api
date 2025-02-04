import { RoleProps } from 'src/core/types/role';
import { RecipientRepository } from '../../repositories/recipient-repository';
import { NotAllowedError } from 'src/core/errors/not-allowed-error';
import { Recipient } from 'src/domain/deliveries/enterprise/entities/recipient';
import { Address } from 'src/domain/deliveries/enterprise/entities/address';

interface CreateRecipientUseCaseProps {
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

export class CreateRecipientUseCase {
  constructor(private recipientRepository: RecipientRepository) {}
  async execute({
    name,
    cpf,
    street,
    number,
    neighborhood,
    city,
    state,
    zipCode,
    role,
  }: CreateRecipientUseCaseProps) {
    if (role !== 'ADMIN') {
      throw new NotAllowedError();
    }
    const address = Address.create({
      street,
      number,
      neighborhood,
      city,
      state,
      zipCode,
    });
    const recipient = Recipient.create({
      cpf,
      name,
      address,
    });
    await this.recipientRepository.create(recipient);
  }
}
