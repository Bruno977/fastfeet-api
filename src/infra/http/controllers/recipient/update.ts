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
import { UpdateRecipientUseCase } from 'src/domain/deliveries/application/use-cases/recipient/update-recipient';

const updateRecipientSchema = z.object({
  name: z.string(),
  cpf: z.string(),
  address: z.object({
    street: z.string(),
    number: z.number(),
    neighborhood: z.string(),
    city: z.string(),
    state: z.string(),
    zipCode: z.string(),
    latitude: z.number(),
    longitude: z.number(),
  }),
});

const bodyValidationPipe = new ZodValidationPipe(updateRecipientSchema);
type UpdateRecipientSchema = z.infer<typeof updateRecipientSchema>;

@Controller('/update-recipient/:id')
export class UpdateRecipientController {
  constructor(private updateRecipient: UpdateRecipientUseCase) {}

  @Put()
  @HttpCode(204)
  async handle(
    @Body(bodyValidationPipe) body: UpdateRecipientSchema,
    @CurrentUser() user: UserPayload,
    @Param('id') recipientId: string,
  ) {
    const { address, cpf, name } = body;

    const currentUserRole = user.role;

    try {
      await this.updateRecipient.execute({
        recipientId,
        name,
        cpf,
        city: address.city,
        latitude: address.latitude,
        longitude: address.longitude,
        neighborhood: address.neighborhood,
        number: address.number,
        state: address.state,
        street: address.street,
        zipCode: address.zipCode,
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
