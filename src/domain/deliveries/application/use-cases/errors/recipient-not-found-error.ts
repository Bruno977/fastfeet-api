export class DeliveryManNotFoundError extends Error {
  constructor() {
    super('Delivery man not found');
  }
}
