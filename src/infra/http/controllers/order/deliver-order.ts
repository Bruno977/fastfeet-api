import {
  BadRequestException,
  Controller,
  FileTypeValidator,
  MaxFileSizeValidator,
  Param,
  ParseFilePipe,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { InvalidAttachmentTypeError } from 'src/domain/deliveries/application/use-cases/errors/invalid-attachment-type-error';
import { DeliverOrderUseCase } from 'src/domain/deliveries/application/use-cases/order/deliver-order';
import { CurrentUser } from 'src/infra/auth/current-user-decorator';
import { UserPayload } from 'src/infra/auth/jwt.strategy';

@Controller('/orders/:orderId/attachments')
export class DeliverOrderController {
  constructor(private deliverOrderUseCase: DeliverOrderUseCase) {}
  @Post()
  @UseInterceptors(FileInterceptor('file'))
  async handle(
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({
            maxSize: 1024 * 1024 * 2, //2mb,
          }),
          new FileTypeValidator({ fileType: '.(png|jpg|jpeg|pdf)' }),
        ],
      }),
    )
    file: Express.Multer.File,
    @Param('orderId') orderId: string,
    @CurrentUser() user: UserPayload,
  ) {
    const { sub } = user;
    try {
      await this.deliverOrderUseCase.execute({
        body: file.buffer,
        fileType: file.mimetype,
        fileName: file.originalname,
        orderId,
        deliveryManId: sub,
      });
    } catch (error) {
      if (error instanceof InvalidAttachmentTypeError) {
        throw new BadRequestException(error.message);
      }
      throw new BadRequestException();
    }
  }
}
