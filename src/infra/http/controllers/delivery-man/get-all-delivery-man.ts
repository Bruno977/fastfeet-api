import {
  BadRequestException,
  Controller,
  Get,
  UnauthorizedException,
} from '@nestjs/common';
import { NotAllowedError } from 'src/core/errors/not-allowed-error';
import { GetAllDeliveryMenUseCase } from 'src/domain/deliveries/application/use-cases/delivery-man/get-all-delivery-man';
import { CurrentUser } from 'src/infra/auth/current-user-decorator';
import { UserPayload } from 'src/infra/auth/jwt.strategy';
import { DeliveryManPresenter } from '../../presenters/delivery-man-presenter';

@Controller('/users')
export class GetAllDeliveryMenController {
  constructor(private getAllDeliveryMen: GetAllDeliveryMenUseCase) {}
  @Get()
  async handle(@CurrentUser() user: UserPayload) {
    const currentUserRole = user.role;
    try {
      const result = await this.getAllDeliveryMen.execute({
        role: currentUserRole,
      });
      return {
        users: result.deliveryMen.map((deliveryMan) =>
          DeliveryManPresenter.toHTTP(deliveryMan),
        ),
      };
    } catch (error) {
      if (error instanceof NotAllowedError) {
        throw new UnauthorizedException(error.message);
      }
      throw new BadRequestException();
    }
  }
}
