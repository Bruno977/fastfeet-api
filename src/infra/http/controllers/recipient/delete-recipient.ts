import {
  BadRequestException,
  Controller,
  Delete,
  HttpCode,
  NotFoundException,
  Param,
  UnauthorizedException,
} from '@nestjs/common';
import { NotAllowedError } from 'src/core/errors/not-allowed-error';
import { ResourceNotFoundError } from 'src/core/errors/resource-not-found-error';
import { DeleteRecipientUseCase } from 'src/domain/deliveries/application/use-cases/recipient/delete-recipient';
import { CurrentUser } from 'src/infra/auth/current-user-decorator';
import { UserPayload } from 'src/infra/auth/jwt.strategy';

@Controller('/recipient/:id')
export class DeleteRecipientController {
  constructor(private deleteRecipient: DeleteRecipientUseCase) {}
  @Delete()
  @HttpCode(204)
  async handle(@Param('id') id: string, @CurrentUser() user: UserPayload) {
    const currentUserRole = user.role;
    try {
      await this.deleteRecipient.execute({
        id,
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
