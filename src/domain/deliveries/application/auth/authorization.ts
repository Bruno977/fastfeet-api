import { RoleProps } from 'src/core/types/role';

type RouteProps =
  | 'delete-delivery-man'
  | 'register-delivery-man'
  | 'update-delivery-man'
  | 'get-delivery-man'
  | 'get-all-delivery-man'
  | 'create-order'
  | 'delete-order'
  | 'get-order-by-user'
  | 'get-order'
  | 'update-order-status'
  | 'update-order'
  | 'get-all-orders'
  | 'create-recipient'
  | 'delete-recipient'
  | 'get-recipient'
  | 'update-recipient'
  | 'get-all-recipients';

export class Authorization {
  private static rolePermissions: Record<RoleProps, RouteProps[]> = {
    ADMIN: [
      //Routes Delivery Man
      'delete-delivery-man',
      'register-delivery-man',
      'update-delivery-man',
      'get-delivery-man',
      'get-all-delivery-man',
      //Routes Order
      'create-order',
      'delete-order',
      'get-order-by-user',
      'get-order',
      'update-order-status',
      'update-order',
      'get-all-orders',
      //Routes Recipient
      'create-recipient',
      'delete-recipient',
      'get-recipient',
      'update-recipient',
      'get-all-recipients',
    ],
    DELIVERY_MAN: [],
  };

  static hasPermission(role: RoleProps, route: RouteProps): boolean {
    return this.rolePermissions?.[role].includes(route) ?? false;
  }
}
