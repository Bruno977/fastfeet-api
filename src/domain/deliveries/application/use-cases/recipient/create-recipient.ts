import { RoleProps } from 'src/core/types/role';
import { RecipientRepository } from '../../repositories/recipient-repository';
import { Recipient } from 'src/domain/deliveries/enterprise/entities/recipient';
import { Address } from 'src/domain/deliveries/enterprise/entities/address';
import { Authorization } from '../../auth/authorization';
import { NotAllowedError } from 'src/core/errors/not-allowed-error';
import { Injectable } from '@nestjs/common';
import { CpfAlreadyExistsError } from '../errors/cpf-already-exists';

interface CreateRecipientUseCaseProps {
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
    latitude,
    longitude,
  }: CreateRecipientUseCaseProps) {
    const isAdmin = Authorization.hasPermission(role, 'create-recipient');
    if (!isAdmin) {
      throw new NotAllowedError();
    }
    const recipientExist = await this.recipientRepository.findByCpf(cpf);
    if (recipientExist) {
      throw new CpfAlreadyExistsError();
    }

    const address = Address.create({
      street,
      number,
      neighborhood,
      city,
      state,
      zipCode,
      latitude,
      longitude,
    });
    const recipient = Recipient.create({
      cpf,
      name,
      address,
    });
    await this.recipientRepository.create(recipient);
  }
}
