import { Entity } from 'src/core/entities/entity';
import { UniqueEntityID } from 'src/core/entities/unique-entity-id';

export interface AttachmentProps {
  title: string;
  url: string;
}

export class Attachment extends Entity<AttachmentProps> {
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
