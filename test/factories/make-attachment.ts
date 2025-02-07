import { UniqueEntityID } from 'src/core/entities/unique-entity-id';
import { faker } from '@faker-js/faker';
import {
  Attachment,
  AttachmentProps,
} from 'src/domain/deliveries/enterprise/entities/attachment';

export function makeAttachment(
  override: Partial<AttachmentProps> = {},
  id?: UniqueEntityID,
) {
  const attachment = Attachment.create(
    {
      title: faker.lorem.word(),
      url: faker.internet.url(),
      ...override,
    },
    id,
  );

  return attachment;
}
