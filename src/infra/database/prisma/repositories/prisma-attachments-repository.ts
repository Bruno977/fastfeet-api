import { Injectable } from '@nestjs/common';
import { AttachmentRepository } from 'src/domain/deliveries/application/repositories/attachments-repository';
import { Attachment } from 'src/domain/deliveries/enterprise/entities/attachment';
import { PrismaService } from '../prisma.service';
import { PrismaAttachmentMapper } from '../mappers/prisma-attachment-mapper';

@Injectable()
export class PrismaAttachmentsRepository implements AttachmentRepository {
  constructor(private prisma: PrismaService) {}
  async create(attachment: Attachment): Promise<void> {
    const data = PrismaAttachmentMapper.toPrisma(attachment);
    await this.prisma.attachment.create({ data });
  }
}
