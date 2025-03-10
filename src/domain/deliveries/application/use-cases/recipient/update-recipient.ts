import { RoleProps } from 'src/core/types/role';
import { RecipientRepository } from '../../repositories/recipient-repository';
import { ResourceNotFoundError } from 'src/core/errors/resource-not-found-error';
import { Authorization } from '../../auth/authorization';
import { NotAllowedError } from 'src/core/errors/not-allowed-error';
import { Injectable } from '@nestjs/common';

interface UpdateRecipientUseCaseRequest {
  recipientId: string;
  name: string;
  cpf: string;
  street: string;
  number: number;
  neighborhood: string;
  city: string;
  state: string;
  zipCode: string;
  latitude: number;
  longitude: number;
  role: RoleProps;
}
@Injectable()
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
    latitude,
    longitude,
    role,
  }: UpdateRecipientUseCaseRequest) {
    const isAdmin = Authorization.hasPermission(role, 'update-recipient');
    if (!isAdmin) {
      throw new NotAllowedError();
    }

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
    recipient.address.latitude = latitude;
    recipient.address.longitude = longitude;

    await this.recipientRepository.update(recipient);
  }
}
