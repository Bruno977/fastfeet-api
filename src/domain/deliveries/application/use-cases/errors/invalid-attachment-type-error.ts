export class InvalidAttachmentTypeError extends Error {
  constructor(fileType: string) {
    super(`Invalid file type: ${fileType}`);
  }
}
