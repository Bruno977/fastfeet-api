import { NotAllowedError } from '../errors/not-allowed-error';
import { RoleProps } from '../types/role';

interface AuthorizationServiceProps {
  role: RoleProps;
  allowedRole: RoleProps;
}

export class AuthorizationService {
  static verifyRole({ role, allowedRole }: AuthorizationServiceProps) {
    if (role !== allowedRole) {
      throw new NotAllowedError();
    }
  }
}
