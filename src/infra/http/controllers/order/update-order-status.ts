import {
  BadRequestException,
  Body,
  Controller,
  HttpCode,
  NotFoundException,
  Param,
  Patch,
  UnauthorizedException,
} from '@nestjs/common';
import { NotAllowedError } from 'src/core/errors/not-allowed-error';
import { ResourceNotFoundError } from 'src/core/errors/resource-not-found-error';
import { DeliveryManNotFoundError } from 'src/domain/deliveries/application/use-cases/errors/delivery-man-not-found-error';
import { UpdateOrderStatusUseCase } from 'src/domain/deliveries/application/use-cases/order/update-order-status';
import { CurrentUser } from 'src/infra/auth/current-user-decorator';
import { UserPayload } from 'src/infra/auth/jwt.strategy';
import { z } from 'zod';
import { ZodValidationPipe } from '../../pipes/zod-validation-pipe';

const updateOrderSchema = z.object({
  status: z.enum(['NEW', 'AWAITING_PICKUP', 'PICKED_UP', 'RETURNED']),
});

const bodyValidationPipe = new ZodValidationPipe(updateOrderSchema);
type UpdateOrderSchema = z.infer<typeof updateOrderSchema>;

@Controller('/orders/:orderId/status')
export class UpdateOrderStatusController {
  constructor(private updateOrderStatus: UpdateOrderStatusUseCase) {}
  @Patch()
  @HttpCode(204)
  async handle(
    @Body(bodyValidationPipe) body: UpdateOrderSchema,
    @CurrentUser() user: UserPayload,
    @Param('orderId') orderId: string,
  ) {
    const { sub, role } = user;
    const { status } = body;

    try {
      await this.updateOrderStatus.execute({
        deliveryManId: sub,
        orderId,
        role,
        status,
      });
    } catch (error) {
      if (error instanceof ResourceNotFoundError) {
        throw new NotFoundException(error.message);
      }
      if (error instanceof DeliveryManNotFoundError) {
        throw new NotFoundException(error.message);
      }
      if (error instanceof NotAllowedError) {
        throw new UnauthorizedException(error.message);
      }
      throw new BadRequestException();
    }
  }
}
