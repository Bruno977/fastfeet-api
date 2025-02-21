import {
  BadRequestException,
  Controller,
  Get,
  NotFoundException,
  Param,
  UnauthorizedException,
} from '@nestjs/common';
import { NotAllowedError } from 'src/core/errors/not-allowed-error';
import { ResourceNotFoundError } from 'src/core/errors/resource-not-found-error';
import { GetOrderUseCase } from 'src/domain/deliveries/application/use-cases/order/get-order';
import { CurrentUser } from 'src/infra/auth/current-user-decorator';
import { UserPayload } from 'src/infra/auth/jwt.strategy';
import { OrderPresenter } from '../../presenters/order-presenter';

@Controller('/order/:id')
export class GetOrderController {
  constructor(private getOrder: GetOrderUseCase) {}
  @Get()
  async handle(@Param('id') orderId: string, @CurrentUser() user: UserPayload) {
    const currentUserRole = user.role;
    try {
      const result = await this.getOrder.execute({
        orderId,
        role: currentUserRole,
      });
      return { order: OrderPresenter.toHTTP(result.order) };
    } catch (error) {
      if (error instanceof NotAllowedError) {
        throw new UnauthorizedException(error.message);
      }
      if (error instanceof ResourceNotFoundError) {
        throw new NotFoundException(error.message);
      }
      throw new BadRequestException();
    }
  }
}
