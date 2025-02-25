import {
  BadRequestException,
  Controller,
  Delete,
  HttpCode,
  NotFoundException,
  Param,
  UnauthorizedException,
} from '@nestjs/common';
import { NotAllowedError } from 'src/core/errors/not-allowed-error';
import { ResourceNotFoundError } from 'src/core/errors/resource-not-found-error';
import { DeleteOrderUseCase } from 'src/domain/deliveries/application/use-cases/order/delete-order';
import { CurrentUser } from 'src/infra/auth/current-user-decorator';
import { UserPayload } from 'src/infra/auth/jwt.strategy';

@Controller('/order/:id')
export class DeleteOrderController {
  constructor(private deleteOrder: DeleteOrderUseCase) {}
  @Delete()
  @HttpCode(204)
  async handle(@Param('id') id: string, @CurrentUser() user: UserPayload) {
    const currentUserRole = user.role;
    try {
      await this.deleteOrder.execute({
        id,
        role: currentUserRole,
      });
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
