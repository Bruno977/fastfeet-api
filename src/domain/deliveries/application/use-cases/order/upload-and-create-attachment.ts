import { AttachmentRepository } from 'src/domain/deliveries/application/repositories/attachments-repository';
import { Attachment } from 'src/domain/deliveries/enterprise/entities/attachment';
import { Uploader } from '../../storage/uploader';
import { InvalidAttachmentTypeError } from '../errors/invalid-attachment-type-error';
import { Injectable } from '@nestjs/common';
import { UniqueEntityID } from 'src/core/entities/unique-entity-id';

export interface UploadAndCreateAttachmentRequest {
  fileName: string;
  fileType: string;
  body: Buffer;
  orderId: string;
}
@Injectable()
export class UploadAndCreateAttachmentUseCase {
  constructor(
    private attachmentRepository: AttachmentRepository,
    private uploader: Uploader,
  ) {}

  async execute({
    body,
    fileName,
    fileType,
    orderId,
  }: UploadAndCreateAttachmentRequest) {
    // console.log('attachmentRepository', this.attachmentRepository);
    if (!/^(image\/(jpeg|png))/.test(fileType)) {
      throw new InvalidAttachmentTypeError(fileType);
    }
    const { url } = await this.uploader.upload({ body, fileName, fileType });
    const attachment = Attachment.create({
      title: fileName,
      url,
      orderId: new UniqueEntityID(orderId),
    });
    await this.attachmentRepository.create(attachment);
    return { attachment };
  }
}
