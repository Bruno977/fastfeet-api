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
import { GetDeliveryManUseCase } from 'src/domain/deliveries/application/use-cases/delivery-man/get-delivery-man';
import { CurrentUser } from 'src/infra/auth/current-user-decorator';
import { UserPayload } from 'src/infra/auth/jwt.strategy';
import { DeliveryManPresenter } from '../../presenters/delivery-man-presenter';

@Controller('/user/:id')
export class GetDeliveryManController {
  constructor(private getDeliveryMan: GetDeliveryManUseCase) {}
  @Get()
  async handle(@Param('id') id: string, @CurrentUser() user: UserPayload) {
    const currentUserRole = user.role;
    try {
      const result = await this.getDeliveryMan.execute({
        id,
        role: currentUserRole,
      });
      return { user: DeliveryManPresenter.toHTTP(result.deliveryMan) };
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
