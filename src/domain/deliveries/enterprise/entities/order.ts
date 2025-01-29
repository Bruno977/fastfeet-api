import { Entity } from 'src/core/entities/entity';
import { UniqueEntityID } from 'src/core/entities/unique-entity-id';

export interface OrderProps {
  description: string;
  status: 'AWAITING_PICKUP' | 'PICKED_UP' | 'DELIVERED' | 'RETURNED';
  deliveryManId: UniqueEntityID;
  // deliveryDate: Date;
}

export class Order extends Entity<OrderProps> {
  get description() {
    return this.props.description;
  }
  get status() {
    return this.props.status;
  }
  get deliveryManId() {
    return this.props.deliveryManId;
  }
  // get deliveryDate() {
  //   return this.props.deliveryDate;
  // }
  static create(props: OrderProps, id?: UniqueEntityID) {
    return new Order(props, id);
  }
}
