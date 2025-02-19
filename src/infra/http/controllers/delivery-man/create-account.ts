import {
  BadRequestException,
  Body,
  ConflictException,
  Controller,
  HttpCode,
  Post,
  UnauthorizedException,
  UsePipes,
} from '@nestjs/common';
import { ZodValidationPipe } from 'src/infra/http/pipes/zod-validation-pipe';
import { z } from 'zod';
import { RegisterDeliveryManUseCase } from 'src/domain/deliveries/application/use-cases/delivery-man/register-delivery-man';
import { NotAllowedError } from 'src/core/errors/not-allowed-error';
import { CpfAlreadyExistsError } from 'src/domain/deliveries/application/use-cases/errors/cpf-already-exists';
import { Public } from 'src/infra/auth/public';

const createAccountBodySchema = z.object({
  name: z.string(),
  password: z.string(),
  cpf: z.string(),
  role: z.enum(['ADMIN', 'DELIVERY_MAN']),
});

type CreateAccountBodySchema = z.infer<typeof createAccountBodySchema>;
@Controller('/accounts')
@Public()
export class CreateAccountController {
  constructor(private registerDeliveryMan: RegisterDeliveryManUseCase) {}

  @Post()
  @HttpCode(201)
  @UsePipes(new ZodValidationPipe(createAccountBodySchema))
  async handle(@Body() body: CreateAccountBodySchema) {
    const { name, cpf, password, role } = body;

    try {
      await this.registerDeliveryMan.execute({
        cpf,
        password,
        name,
        role,
      });
    } catch (error: unknown) {
      if (error instanceof NotAllowedError) {
        throw new UnauthorizedException(error.message);
      }
      if (error instanceof CpfAlreadyExistsError) {
        throw new ConflictException(error.message);
      }
      throw new BadRequestException();
    }
  }
}
