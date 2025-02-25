import { Entity } from 'src/core/entities/entity';
import { UniqueEntityID } from 'src/core/entities/unique-entity-id';

export interface AttachmentProps {
  title: string;
  url: string;
  orderId: UniqueEntityID;
}

export class Attachment extends Entity<AttachmentProps> {
  get orderId() {
    return this.props.orderId;
  }
  set orderId(value: UniqueEntityID) {
    this.props.orderId = value;
  }
  get title() {
    return this.props.title;
  }
  get url() {
    return this.props.url;
  }
  set title(value: string) {
    this.props.title = value;
  }
  set url(value: string) {
    this.props.url = value;
  }
  static create(props: AttachmentProps, id?: UniqueEntityID) {
    return new Attachment(props, id);
  }
}
