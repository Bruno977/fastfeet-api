import { NotAllowedError } from '../errors/not-allowed-error';
import { AuthorizationService } from './authorization-service';

describe('Authorization Service', () => {
  it('should throw NotAllowedError if user is not an admin', async () => {
    expect(() =>
      AuthorizationService.verifyRole({
        role: 'DELIVERY_MAN',
        allowedRole: 'ADMIN',
      }),
    ).toThrow(NotAllowedError);
  });
  it('should not throw an error if the user has the correct role', async () => {
    expect(() =>
      AuthorizationService.verifyRole({
        role: 'ADMIN',
        allowedRole: 'ADMIN',
      }),
    ).not.toThrow();
  });
});
