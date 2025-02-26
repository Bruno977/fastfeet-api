import {
  BadRequestException,
  Controller,
  Get,
  Query,
  UnauthorizedException,
} from '@nestjs/common';
import { NotAllowedError } from 'src/core/errors/not-allowed-error';
import { GetAllDeliveryMenUseCase } from 'src/domain/deliveries/application/use-cases/delivery-man/get-all-delivery-man';
import { CurrentUser } from 'src/infra/auth/current-user-decorator';
import { UserPayload } from 'src/infra/auth/jwt.strategy';
import { DeliveryManPresenter } from '../../presenters/delivery-man-presenter';
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

@Controller('/users')
export class GetAllDeliveryMenController {
  constructor(private getAllDeliveryMen: GetAllDeliveryMenUseCase) {}
  @Get()
  async handle(
    @Query('page', queryValidationPipe) page: PageQueryParamSchema,
    @CurrentUser() user: UserPayload,
  ) {
    const currentUserRole = user.role;
    try {
      const result = await this.getAllDeliveryMen.execute({
        role: currentUserRole,
        page,
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
