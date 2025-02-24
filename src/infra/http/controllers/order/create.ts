import {
  BadRequestException,
  Body,
  Controller,
  NotFoundException,
  Post,
  UnauthorizedException,
} from '@nestjs/common';
import { CreateOrderUseCase } from 'src/domain/deliveries/application/use-cases/order/create-order';
import { z } from 'zod';
import { ZodValidationPipe } from '../../pipes/zod-validation-pipe';
import { NotAllowedError } from 'src/core/errors/not-allowed-error';
import { UserPayload } from 'src/infra/auth/jwt.strategy';
import { CurrentUser } from 'src/infra/auth/current-user-decorator';
import { DeliveryManNotFoundError } from 'src/domain/deliveries/application/use-cases/errors/delivery-man-not-found-error';
import { RecipientNotFoundError } from 'src/domain/deliveries/application/use-cases/errors/recipient-not-found-error';
const createOrderSchema = z.object({
  description: z.string(),
  user_id: z.string().uuid(),
  recipient_id: z.string().uuid(),
});
const bodyValidationPipe = new ZodValidationPipe(createOrderSchema);

type CreateOrderSchema = z.infer<typeof createOrderSchema>;

@Controller('/orders')
export class CreateOrderController {
  constructor(private createOrderController: CreateOrderUseCase) {}
  @Post()
  async handle(
    @Body(bodyValidationPipe) body: CreateOrderSchema,
    @CurrentUser() user: UserPayload,
  ) {
    const { user_id, description, recipient_id } = body;
    const { role } = user;
    try {
      await this.createOrderController.execute({
        description,
        deliveryManId: user_id,
        recipientId: recipient_id,
        role: role,
      });
    } catch (error) {
      if (error instanceof NotAllowedError) {
        throw new UnauthorizedException(error.message);
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
