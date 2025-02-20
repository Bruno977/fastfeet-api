import {
  BadRequestException,
  Body,
  Controller,
  Post,
  UnauthorizedException,
} from '@nestjs/common';
import { CreateRecipientUseCase } from 'src/domain/deliveries/application/use-cases/recipient/create-recipient';
import { z } from 'zod';
import { ZodValidationPipe } from '../../pipes/zod-validation-pipe';
import { NotAllowedError } from 'src/core/errors/not-allowed-error';
import { UserPayload } from 'src/infra/auth/jwt.strategy';
import { CurrentUser } from 'src/infra/auth/current-user-decorator';
const createRecipientSchema = z.object({
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
const bodyValidationPipe = new ZodValidationPipe(createRecipientSchema);

type CreateRecipientSchema = z.infer<typeof createRecipientSchema>;

@Controller('/recipients')
export class CreateRecipientController {
  constructor(private createRecipientController: CreateRecipientUseCase) {}
  @Post()
  async handle(
    @Body(bodyValidationPipe) body: CreateRecipientSchema,
    @CurrentUser() user: UserPayload,
  ) {
    const { address, cpf, name } = body;
    const currentUserRole = user.role;
    try {
      await this.createRecipientController.execute({
        cpf,
        name,
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

      throw new BadRequestException();
    }
  }
}
