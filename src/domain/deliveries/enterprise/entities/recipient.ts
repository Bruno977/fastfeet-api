import { UniqueEntityID } from 'src/core/entities/unique-entity-id';
import { Address } from './address';
import { Entity } from 'src/core/entities/entity';

export interface RecipientProps {
  name: string;
  cpf: string;
  address: Address;
}

export class Recipient extends Entity<RecipientProps> {
  get name() {
    return this.props.name;
  }
  set name(value: string) {
    this.props.name = value;
  }
  get cpf() {
    return this.props.cpf;
  }
  set cpf(value: string) {
    this.props.cpf = value;
  }
  get address() {
    return this.props.address;
  }
  static create(props: RecipientProps, id?: UniqueEntityID) {
    return new Recipient(props, id);
  }
}
