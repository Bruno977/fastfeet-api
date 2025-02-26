import {
  BadRequestException,
  Controller,
  Get,
  UnauthorizedException,
} from '@nestjs/common';
import { NotAllowedError } from 'src/core/errors/not-allowed-error';
import { GetAllOrdersUseCase } from 'src/domain/deliveries/application/use-cases/order/get-all-orders';
import { CurrentUser } from 'src/infra/auth/current-user-decorator';
import { UserPayload } from 'src/infra/auth/jwt.strategy';
import { OrderPresenter } from '../../presenters/order-presenter';

@Controller('/orders')
export class GetAllOrdersController {
  constructor(private getAllOrders: GetAllOrdersUseCase) {}
  @Get()
  async handle(@CurrentUser() user: UserPayload) {
    const currentUserRole = user.role;
    try {
      const result = await this.getAllOrders.execute({
        role: currentUserRole,
      });
      return {
        orders: result.orders.map((order) => OrderPresenter.toHTTP(order)),
      };
    } catch (error) {
      if (error instanceof NotAllowedError) {
        throw new UnauthorizedException(error.message);
      }
      throw new BadRequestException();
    }
  }
}
