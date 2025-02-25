import { AttachmentRepository } from 'src/domain/deliveries/application/repositories/attachments-repository';
import { Attachment } from 'src/domain/deliveries/enterprise/entities/attachment';
import { Uploader } from '../../storage/uploader';
import { InvalidAttachmentTypeError } from '../errors/invalid-attachment-type-error';
import { Injectable } from '@nestjs/common';
import { UniqueEntityID } from 'src/core/entities/unique-entity-id';
import { OrderRepository } from '../../repositories/order-repository';
import { ResourceNotFoundError } from 'src/core/errors/resource-not-found-error';
import { DeliveryManRepository } from '../../repositories/delivery-man-repository';
import { DeliveryManNotFoundError } from '../errors/delivery-man-not-found-error';
import { NotAllowedError } from 'src/core/errors/not-allowed-error';

export interface DeliverOrderUseCaseRequest {
  fileName: string;
  fileType: string;
  body: Buffer;
  orderId: string;
  deliveryManId: string;
}
@Injectable()
export class DeliverOrderUseCase {
  constructor(
    private attachmentRepository: AttachmentRepository,
    private orderRepository: OrderRepository,
    private deliveryManRepository: DeliveryManRepository,
    private uploader: Uploader,
  ) {}

  async execute({
    body,
    fileName,
    fileType,
    orderId,
    deliveryManId,
  }: DeliverOrderUseCaseRequest) {
    const order = await this.orderRepository.findById(orderId);
    if (!order) {
      throw new ResourceNotFoundError();
    }
    const deliveryMan =
      await this.deliveryManRepository.findById(deliveryManId);
    if (!deliveryMan) {
      throw new DeliveryManNotFoundError();
    }

    const isSameDeliveryMan = order.deliveryManId.toString() === deliveryManId;
    if (!isSameDeliveryMan) {
      throw new NotAllowedError();
    }

    if (!/^(image\/(png|jpg|jpeg|pdf))/.test(fileType)) {
      throw new InvalidAttachmentTypeError(fileType);
    }
    const { url } = await this.uploader.upload({ body, fileName, fileType });

    const attachment = Attachment.create({
      title: fileName,
      url,
      orderId: new UniqueEntityID(orderId),
    });
    await this.attachmentRepository.create(attachment);

    order.status = 'DELIVERED';
    order.attachmentId = attachment.id;

    await this.orderRepository.update(order);

    return { order };
  }
}
