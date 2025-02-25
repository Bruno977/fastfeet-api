import { Prisma } from '@prisma/client';
import { Attachment } from './../../../../domain/deliveries/enterprise/entities/attachment';
export class PrismaAttachmentMapper {
  static toPrisma(
    attachment: Attachment,
  ): Prisma.AttachmentUncheckedCreateInput {
    return {
      id: attachment.id.toString(),
      title: attachment.title,
      url: attachment.url,
      order_id: attachment.orderId.toString(),
    };
  }
}
