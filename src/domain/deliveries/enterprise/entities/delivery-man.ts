import { Entity } from 'src/core/entities/entity';
import { UniqueEntityID } from 'src/core/entities/unique-entity-id';

interface DeliveryManProps {
  name: string;
  cpf: string;
  password: string;
}

export class DeliveryMan extends Entity<DeliveryManProps> {
  get name() {
    return this.props.name;
  }
  get cpf() {
    return this.props.cpf;
  }
  get password() {
    return this.props.password;
  }
  static create(props: DeliveryManProps, id?: UniqueEntityID) {
    return new DeliveryMan(props, id);
  }
}
