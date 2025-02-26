import {
  BadRequestException,
  Controller,
  Get,
  UnauthorizedException,
} from '@nestjs/common';
import { NotAllowedError } from 'src/core/errors/not-allowed-error';
import { GetAllRecipientsUseCase } from 'src/domain/deliveries/application/use-cases/recipient/get-all-recipients';
import { CurrentUser } from 'src/infra/auth/current-user-decorator';
import { UserPayload } from 'src/infra/auth/jwt.strategy';
import { RecipientPresenter } from '../../presenters/recipient-presenter';

@Controller('/recipients')
export class GetAllRecipientsController {
  constructor(private getAllRecipients: GetAllRecipientsUseCase) {}
  @Get()
  async handle(@CurrentUser() user: UserPayload) {
    const currentUserRole = user.role;
    try {
      const result = await this.getAllRecipients.execute({
        role: currentUserRole,
      });
      return {
        recipients: result.recipients.map((recipient) =>
          RecipientPresenter.toHTTP(recipient),
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
