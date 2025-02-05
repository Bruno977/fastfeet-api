import { Authorization } from './authorization';

describe('Authorization', () => {
  it('should return true if user has permission', () => {
    const deliveryMan = Authorization.hasPermission(
      'ADMIN',
      'delete-delivery-man',
    );
    expect(deliveryMan).toBe(true);
  });
  it('should return false if user does not have permission', () => {
    const deliveryMan = Authorization.hasPermission(
      'DELIVERY_MAN',
      'delete-delivery-man',
    );
    expect(deliveryMan).toBe(false);
  });
});
