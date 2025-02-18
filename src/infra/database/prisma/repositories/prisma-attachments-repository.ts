import { Injectable } from '@nestjs/common';
import { AttachmentRepository } from 'src/domain/deliveries/application/repositories/attachments-repository';
import { Attachment } from 'src/domain/deliveries/enterprise/entities/attachment';

@Injectable()
export class PrismaAttachmentsRepository implements AttachmentRepository {
  create(attachment: Attachment): Promise<void> {
    throw new Error('Method not implemented.');
  }
}
