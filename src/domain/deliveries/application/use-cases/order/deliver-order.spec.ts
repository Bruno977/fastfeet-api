import { InMemoryDeliveryManRepository } from './../../../../../../test/repositories/in-memory-delivery-man-repository';
import { InMemoryOrderRepository } from './../../../../../../test/repositories/in-memory-order-repository';
import { FakeUploader } from './../../../../../../test/storage/fake-uploader';
import { InMemoryAttachmentRepository } from './../../../../../../test/repositories/in-memory-attachments-repository';
import { DeliverOrderUseCase } from './deliver-order';
import { InMemoryRecipientRepository } from 'test/repositories/in-memory-recipient-repository';
import { ResourceNotFoundError } from 'src/core/errors/resource-not-found-error';
import { makeOrder } from 'test/factories/makeOrder';
import { DeliveryManNotFoundError } from '../errors/delivery-man-not-found-error';
import { makeDeliveryMan } from 'test/factories/makeDeliveryMan';
import { NotAllowedError } from 'src/core/errors/not-allowed-error';
import { InvalidAttachmentTypeError } from '../errors/invalid-attachment-type-error';

let deliverOrderUseCase: DeliverOrderUseCase;
let fakeUploader: FakeUploader;
let inMemoryAttachmentRepository: InMemoryAttachmentRepository;
let inMemoryOrderRepository: InMemoryOrderRepository;
let inMemoryDeliveryManRepository: InMemoryDeliveryManRepository;
let inMemoryRecipientRepository: InMemoryRecipientRepository;

describe('DeliverOrderUseCase', () => {
  beforeEach(() => {
    inMemoryAttachmentRepository = new InMemoryAttachmentRepository();
    inMemoryRecipientRepository = new InMemoryRecipientRepository();
    inMemoryDeliveryManRepository = new InMemoryDeliveryManRepository();
    inMemoryOrderRepository = new InMemoryOrderRepository(
      inMemoryRecipientRepository,
    );
    fakeUploader = new FakeUploader();
    deliverOrderUseCase = new DeliverOrderUseCase(
      inMemoryAttachmentRepository,
      inMemoryOrderRepository,
      inMemoryDeliveryManRepository,
      fakeUploader,
    );
  });
  it('should throw error if order does not exist', async () => {
    const newAttachment = {
      fileName: 'test.jpg',
      fileType: 'image/jpeg',
      body: Buffer.from(''),
      orderId: 'non-existent-order-id',
      deliveryManId: 'delivery-man-id',
    };
    await expect(deliverOrderUseCase.execute(newAttachment)).rejects.toThrow(
      ResourceNotFoundError,
    );
  });
  it('should throw error if delivery man does not exist', async () => {
    const newOrder = makeOrder();
    await inMemoryOrderRepository.create(newOrder);
    const newAttachment = {
      fileName: 'test.jpg',
      fileType: 'image/jpeg',
      body: Buffer.from(''),
      orderId: newOrder.id.toString(),
      deliveryManId: 'delivery-man-id',
    };
    await expect(deliverOrderUseCase.execute(newAttachment)).rejects.toThrow(
      DeliveryManNotFoundError,
    );
  });
  it('should throw error if delivery man is not assigned to the order', async () => {
    const newDeliveryMan = makeDeliveryMan();
    const newOrder = makeOrder();
    await inMemoryOrderRepository.create(newOrder);
    await inMemoryDeliveryManRepository.create(newDeliveryMan);
    const newAttachment = {
      fileName: 'test.jpg',
      fileType: 'image/jpeg',
      body: Buffer.from(''),
      orderId: newOrder.id.toString(),
      deliveryManId: newDeliveryMan.id.toString(),
    };
    await expect(deliverOrderUseCase.execute(newAttachment)).rejects.toThrow(
      NotAllowedError,
    );
  });
  it('should throw error if attachment type is invalid', async () => {
    const newDeliveryMan = makeDeliveryMan();
    const newOrder = makeOrder({
      deliveryManId: newDeliveryMan.id,
    });
    await inMemoryOrderRepository.create(newOrder);
    await inMemoryDeliveryManRepository.create(newDeliveryMan);
    const newAttachment = {
      fileName: 'test.jpg',
      fileType: 'image/webp',
      body: Buffer.from(''),
      orderId: newOrder.id.toString(),
      deliveryManId: newDeliveryMan.id.toString(),
    };
    await expect(deliverOrderUseCase.execute(newAttachment)).rejects.toThrow(
      InvalidAttachmentTypeError,
    );
  });
  it('should mark order as DELIVERED', async () => {
    const newDeliveryMan = makeDeliveryMan();
    const newOrder = makeOrder({
      deliveryManId: newDeliveryMan.id,
    });
    await inMemoryOrderRepository.create(newOrder);
    await inMemoryDeliveryManRepository.create(newDeliveryMan);
    const newAttachment = {
      fileName: 'test.jpg',
      fileType: 'image/png',
      body: Buffer.from(''),
      orderId: newOrder.id.toString(),
      deliveryManId: newDeliveryMan.id.toString(),
    };
    const response = await deliverOrderUseCase.execute(newAttachment);

    const attachment = inMemoryAttachmentRepository.attachments[0];
    expect(response.order.attachmentId?.toString()).toBe(
      attachment.id.toString(),
    );
  });
});
