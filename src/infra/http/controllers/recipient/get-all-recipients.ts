import {
  BadRequestException,
  Controller,
  Get,
  Query,
  UnauthorizedException,
} from '@nestjs/common';
import { NotAllowedError } from 'src/core/errors/not-allowed-error';
import { GetAllRecipientsUseCase } from 'src/domain/deliveries/application/use-cases/recipient/get-all-recipients';
import { CurrentUser } from 'src/infra/auth/current-user-decorator';
import { UserPayload } from 'src/infra/auth/jwt.strategy';
import { RecipientPresenter } from '../../presenters/recipient-presenter';
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

@Controller('/recipients')
export class GetAllRecipientsController {
  constructor(private getAllRecipients: GetAllRecipientsUseCase) {}
  @Get()
  async handle(
    @Query('page', queryValidationPipe) page: PageQueryParamSchema,
    @CurrentUser() user: UserPayload,
  ) {
    const currentUserRole = user.role;
    try {
      const result = await this.getAllRecipients.execute({
        role: currentUserRole,
        page,
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
