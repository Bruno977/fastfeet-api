import { Entity } from 'src/core/entities/entity';
import { UniqueEntityID } from 'src/core/entities/unique-entity-id';
import { ORDER_STATUS } from 'src/core/types/orderStatus';

export interface OrderProps {
  description: string;
  status: ORDER_STATUS;
  deliveryManId: UniqueEntityID;
  // deliveryDate: Date;
}

export class Order extends Entity<OrderProps> {
  get description() {
    return this.props.description;
  }
  set description(value: string) {
    this.props.description = value;
  }
  get status() {
    return this.props.status;
  }
  set status(value: ORDER_STATUS) {
    this.props.status = value;
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
