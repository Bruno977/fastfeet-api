import { AttachmentRepository } from 'src/domain/deliveries/application/repositories/attachments-repository';
import { Attachment } from 'src/domain/deliveries/enterprise/entities/attachment';

export class InMemoryAttachmentRepository implements AttachmentRepository {
  public attachments: Attachment[] = [];
  async create(attachment: Attachment) {
    this.attachments.push(attachment);
  }
}
