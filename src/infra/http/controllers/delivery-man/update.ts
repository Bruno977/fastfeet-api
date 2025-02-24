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
import { UpdateDeliveryManUseCase } from 'src/domain/deliveries/application/use-cases/delivery-man/update-delivery-man';
import { z } from 'zod';
import { ZodValidationPipe } from '../../pipes/zod-validation-pipe';
import { CurrentUser } from 'src/infra/auth/current-user-decorator';
import { UserPayload } from 'src/infra/auth/jwt.strategy';
import { NotAllowedError } from 'src/core/errors/not-allowed-error';
import { ResourceNotFoundError } from 'src/core/errors/resource-not-found-error';

const updateDeliveryManSchema = z.object({
  name: z.string(),
  password: z.string().optional(),
  role: z.enum(['ADMIN', 'DELIVERY_MAN']).optional(),
});

const bodyValidationPipe = new ZodValidationPipe(updateDeliveryManSchema);
type UpdateDeliveryManSchema = z.infer<typeof updateDeliveryManSchema>;

@Controller('/update-user/:id')
export class UpdateDeliveryManController {
  constructor(private updateDeliveryMan: UpdateDeliveryManUseCase) {}

  @Put()
  @HttpCode(204)
  async handle(
    @Body(bodyValidationPipe) body: UpdateDeliveryManSchema,
    @CurrentUser() user: UserPayload,
    @Param('id') deliveryManId: string,
  ) {
    const { name, password } = body;

    const currentUserRole = user.role;

    try {
      await this.updateDeliveryMan.execute({
        id: deliveryManId,
        name,
        password,
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
