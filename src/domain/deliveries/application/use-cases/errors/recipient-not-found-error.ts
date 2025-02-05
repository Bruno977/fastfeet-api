export class RecipientNotFoundError extends Error {
  constructor() {
    super('Recipient not found');
  }
}
