import {
  BadRequestException,
  Controller,
  Get,
  Query,
  UnauthorizedException,
} from '@nestjs/common';
import { NotAllowedError } from 'src/core/errors/not-allowed-error';
import { FindManyNearbyUseCase } from 'src/domain/deliveries/application/use-cases/order/find-many-nearby';
import { CurrentUser } from 'src/infra/auth/current-user-decorator';
import { UserPayload } from 'src/infra/auth/jwt.strategy';
import { z } from 'zod';
import { ZodValidationPipe } from '../../pipes/zod-validation-pipe';
import { OrderPresenter } from '../../presenters/order-presenter';

const coordinatesSchema = z.object({
  latitude: z.coerce.number().refine((value) => Math.abs(value) <= 90, {
    message: 'Latitude must be between -90 and 90',
  }),
  longitude: z.coerce.number().refine((value) => Math.abs(value) <= 180, {
    message: 'Longitude must be between -180 and 180',
  }),
});

type CoordinatesSchema = z.infer<typeof coordinatesSchema>;

const queryValidationPipe = new ZodValidationPipe(coordinatesSchema);

@Controller('/orders/nearby')
export class GetOrdersNearbyController {
  constructor(private findManyNearbyUseCase: FindManyNearbyUseCase) {}
  @Get()
  async handle(
    @Query(queryValidationPipe) query: CoordinatesSchema,
    @CurrentUser() user: UserPayload,
  ) {
    const { sub } = user;

    try {
      const result = await this.findManyNearbyUseCase.execute({
        deliveryManId: sub,
        deliveryManLatitude: query.latitude,
        deliveryManLongitude: query.longitude,
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
