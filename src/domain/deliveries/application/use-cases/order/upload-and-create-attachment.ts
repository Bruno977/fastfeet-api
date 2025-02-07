import { AttachmentRepository } from 'src/domain/deliveries/application/repositories/attachments-repository';
import { Attachment } from 'src/domain/deliveries/enterprise/entities/attachment';
import { Uploader } from '../../storage/uploader';
import { InvalidAttachmentTypeError } from '../errors/invalid-attachment-type-error';

export interface UploadAndCreateAttachmentRequest {
  fileName: string;
  fileType: string;
  body: Buffer;
}
export class UploadAndCreateAttachmentUseCase {
  constructor(
    private attachmentRepository: AttachmentRepository,
    private uploader: Uploader,
  ) {}

  async execute({
    body,
    fileName,
    fileType,
  }: UploadAndCreateAttachmentRequest) {
    if (!/^(image\/(jpeg|png))/.test(fileType)) {
      throw new InvalidAttachmentTypeError(fileType);
    }
    const { url } = await this.uploader.upload({ body, fileName, fileType });
    const attachment = Attachment.create({
      title: fileName,
      url,
    });
    await this.attachmentRepository.create(attachment);
    return { attachment };
  }
}
