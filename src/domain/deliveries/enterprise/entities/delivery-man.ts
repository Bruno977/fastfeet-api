import { Entity } from 'src/core/entities/entity';
import { UniqueEntityID } from 'src/core/entities/unique-entity-id';
import { RoleProps } from 'src/core/types/role';

export interface DeliveryManProps {
  name: string;
  cpf: string;
  password: string;
  role: RoleProps;
}

export class DeliveryMan extends Entity<DeliveryManProps> {
  get name() {
    return this.props.name;
  }
  set name(name: string) {
    this.props.name = name;
  }
  get cpf() {
    return this.props.cpf;
  }

  get password() {
    return this.props.password;
  }

  set password(password: string) {
    this.props.password = password;
  }

  get role() {
    return this.props.role;
  }

  set role(role: RoleProps) {
    this.props.role = role;
  }

  static create(props: DeliveryManProps, id?: UniqueEntityID) {
    return new DeliveryMan(props, id);
  }
}
