import {
  BadRequestException,
  Controller,
  Get,
  Query,
  UnauthorizedException,
} from '@nestjs/common';
import { NotAllowedError } from 'src/core/errors/not-allowed-error';
import { GetAllOrdersUseCase } from 'src/domain/deliveries/application/use-cases/order/get-all-orders';
import { CurrentUser } from 'src/infra/auth/current-user-decorator';
import { UserPayload } from 'src/infra/auth/jwt.strategy';
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

@Controller('/orders')
export class GetAllOrdersController {
  constructor(private getAllOrders: GetAllOrdersUseCase) {}
  @Get()
  async handle(
    @Query('page', queryValidationPipe) page: PageQueryParamSchema,
    @CurrentUser() user: UserPayload,
  ) {
    const currentUserRole = user.role;
    try {
      const result = await this.getAllOrders.execute({
        role: currentUserRole,
        page,
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
