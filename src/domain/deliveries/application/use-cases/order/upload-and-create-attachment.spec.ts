import { FakeUploader } from './../../../../../../test/storage/fake-uploader';
import { InMemoryAttachmentRepository } from './../../../../../../test/repositories/in-memory-attachments-repository';
import { UploadAndCreateAttachmentUseCase } from './upload-and-create-attachment';

let uploadAndCreateAttachmentUseCase: UploadAndCreateAttachmentUseCase;
let fakeUploader: FakeUploader;
let inMemoryAttachmentRepository: InMemoryAttachmentRepository;
describe('UploadAndCreateAttachmentUseCase', () => {
  beforeEach(() => {
    inMemoryAttachmentRepository = new InMemoryAttachmentRepository();
    fakeUploader = new FakeUploader();
    uploadAndCreateAttachmentUseCase = new UploadAndCreateAttachmentUseCase(
      inMemoryAttachmentRepository,
      fakeUploader,
    );
  });
  it('should create attachment', async () => {
    const newAttachment = {
      fileName: 'test.jpg',
      fileType: 'image/jpeg',
      body: Buffer.from(''),
    };
    const response =
      await uploadAndCreateAttachmentUseCase.execute(newAttachment);
    expect(response.attachment.title).toBe(newAttachment.fileName);
    expect(response.attachment.url).toBe(fakeUploader.uploads[0].url);
  });
});
