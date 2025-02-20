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
import { GetRecipientUseCase } from 'src/domain/deliveries/application/use-cases/recipient/get-recipient';
import { CurrentUser } from 'src/infra/auth/current-user-decorator';
import { UserPayload } from 'src/infra/auth/jwt.strategy';
import { RecipientPresenter } from '../../presenters/recipient-presenter';

@Controller('/recipient/:id')
export class GetRecipientController {
  constructor(private getRecipient: GetRecipientUseCase) {}
  @Get()
  async handle(
    @Param('id') recipientId: string,
    @CurrentUser() user: UserPayload,
  ) {
    const currentUserRole = user.role;
    try {
      const result = await this.getRecipient.execute({
        recipientId,
        role: currentUserRole,
      });
      return { recipient: RecipientPresenter.toHTTP(result.recipient) };
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
