import {
  BadRequestException,
  Controller,
  Get,
  NotFoundException,
  Param,
  Query,
  UnauthorizedException,
} from '@nestjs/common';
import { GetOrderByUserUseCase } from '../../../../domain/deliveries/application/use-cases/order/get-order-by-user';
import { CurrentUser } from 'src/infra/auth/current-user-decorator';
import { UserPayload } from 'src/infra/auth/jwt.strategy';
import { NotAllowedError } from 'src/core/errors/not-allowed-error';
import { DeliveryManNotFoundError } from 'src/domain/deliveries/application/use-cases/errors/delivery-man-not-found-error';
import { OrderPresenter } from '../../presenters/order-presenter';
import { z } from 'zod';
import { ZodValidationPipe } from '../../pipes/zod-validation-pipe';

const pageQueryParamSchema = z
  .string()
  .optional()
  .default('1')
  .transform(Number)
  .pipe(z.number().min(1));

const queryValidationPipe = new ZodValidationPipe(pageQueryParamSchema);

type PageQueryParamSchema = z.infer<typeof pageQueryParamSchema>;

@Controller('/users/:id/orders')
export class GetOrdersByUserController {
  constructor(private getOrderByUser: GetOrderByUserUseCase) {}
  @Get()
  async handle(
    @Query('page', queryValidationPipe) page: PageQueryParamSchema,
    @Param('id') userId: string,
    @CurrentUser() user: UserPayload,
  ) {
    const { sub } = user;
    try {
      const result = await this.getOrderByUser.execute({
        currentUserId: sub,
        deliveryManId: userId,
        page,
      });
      return {
        orders: result.orders.map((order) => OrderPresenter.toHTTP(order)),
      };
    } catch (error) {
      if (error instanceof NotAllowedError) {
        throw new UnauthorizedException(error.message);
      }
      if (error instanceof DeliveryManNotFoundError) {
        throw new NotFoundException(error.message);
      }
      throw new BadRequestException();
    }
  }
}
