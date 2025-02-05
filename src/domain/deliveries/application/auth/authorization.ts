import { RoleProps } from 'src/core/types/role';

type RouteProps =
  | 'delete-delivery-man'
  | 'register-delivery-man'
  | 'update-delivery-man'
  | 'get-delivery-man'
  | 'create-order'
  | 'delete-order'
  | 'get-order-by-user'
  | 'get-order'
  | 'update-order-status'
  | 'update-order'
  | 'create-recipient'
  | 'delete-recipient'
  | 'get-recipient'
  | 'update-recipient';

export class Authorization {
  private static rolePermissions: Record<RoleProps, RouteProps[]> = {
    ADMIN: [
      //Routes Delivery Man
      'delete-delivery-man',
      'register-delivery-man',
      'update-delivery-man',
      'get-delivery-man',
      //Routes Order
      'create-order',
      'delete-order',
      'get-order-by-user',
      'get-order',
      'update-order-status',
      'update-order',
      //Routes Recipient
      'create-recipient',
      'delete-recipient',
      'get-recipient',
      'update-recipient',
    ],
    DELIVERY_MAN: [],
  };

  static hasPermission(role: RoleProps, route: RouteProps): boolean {
    return this.rolePermissions?.[role].includes(route) ?? false;
  }
}
