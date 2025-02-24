import {
  BadRequestException,
  Body,
  Controller,
  HttpCode,
  NotFoundException,
  Param,
  Put,
  UnauthorizedException,
} from '@nestjs/common';
import { z } from 'zod';
import { ZodValidationPipe } from '../../pipes/zod-validation-pipe';
import { CurrentUser } from 'src/infra/auth/current-user-decorator';
import { UserPayload } from 'src/infra/auth/jwt.strategy';
import { NotAllowedError } from 'src/core/errors/not-allowed-error';
import { ResourceNotFoundError } from 'src/core/errors/resource-not-found-error';
import { UpdateOrderUseCase } from 'src/domain/deliveries/application/use-cases/order/update-order';
import { DeliveryManNotFoundError } from 'src/domain/deliveries/application/use-cases/errors/delivery-man-not-found-error';
import { RecipientNotFoundError } from 'src/domain/deliveries/application/use-cases/errors/recipient-not-found-error';

const updateOrderSchema = z.object({
  description: z.string(),
  user_id: z.string().uuid(),
  recipient_id: z.string().uuid(),
});

const bodyValidationPipe = new ZodValidationPipe(updateOrderSchema);
type UpdateOrderSchema = z.infer<typeof updateOrderSchema>;

@Controller('/update-order/:id')
export class UpdateOrderController {
  constructor(private updateOrder: UpdateOrderUseCase) {}

  @Put()
  @HttpCode(204)
  async handle(
    @Body(bodyValidationPipe) body: UpdateOrderSchema,
    @CurrentUser() user: UserPayload,
    @Param('id') orderId: string,
  ) {
    const { description, recipient_id, user_id } = body;

    const currentUserRole = user.role;

    try {
      await this.updateOrder.execute({
        orderId,
        role: currentUserRole,
        description,
        deliveryManId: user_id,
        recipientId: recipient_id,
      });
    } catch (error) {
      console.log(error);
      if (error instanceof NotAllowedError) {
        throw new UnauthorizedException(error.message);
      }
      if (error instanceof ResourceNotFoundError) {
        throw new NotFoundException(error.message);
      }
      if (error instanceof DeliveryManNotFoundError) {
        throw new NotFoundException(error.message);
      }
      if (error instanceof RecipientNotFoundError) {
        throw new NotFoundException(error.message);
      }
      throw new BadRequestException();
    }
  }
}
