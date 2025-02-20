import { Recipient } from 'src/domain/deliveries/enterprise/entities/recipient';

export class RecipientPresenter {
  static toHTTP(recipient: Recipient) {
    return {
      cpf: recipient.cpf,
      name: recipient.name,
      address: {
        city: recipient.address.city,
        latitude: recipient.address.latitude,
        longitude: recipient.address.longitude,
        neighborhood: recipient.address.neighborhood,
        number: recipient.address.number,
        state: recipient.address.state,
        street: recipient.address.street,
        zipCode: recipient.address.zipCode,
      },
    };
  }
}
