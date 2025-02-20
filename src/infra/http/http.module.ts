import { DatabaseModule } from './../database/database.module';
import { Module } from '@nestjs/common';
import { CreateAccountController } from './controllers/delivery-man/create-account';
import { AuthenticateController } from './controllers/delivery-man/authenticate';
import { RegisterDeliveryManUseCase } from 'src/domain/deliveries/application/use-cases/delivery-man/register-delivery-man';
import { AuthenticateDeliveryManUseCase } from 'src/domain/deliveries/application/use-cases/delivery-man/authenticate-delivery-man';
import { CryptographyModule } from '../cryptography/cryptography.module';
import { UpdateDeliveryManController } from './controllers/delivery-man/update';
import { UpdateDeliveryManUseCase } from 'src/domain/deliveries/application/use-cases/delivery-man/update-delivery-man';
import { GetDeliveryManController } from './controllers/delivery-man/get';
import { GetDeliveryManUseCase } from 'src/domain/deliveries/application/use-cases/delivery-man/get-delivery-man';
import { DeleteDeliveryManController } from './controllers/delivery-man/delete';
import { DeleteDeliveryManUseCase } from 'src/domain/deliveries/application/use-cases/delivery-man/delete-delivery-man';
import { CreateRecipientController } from './controllers/recipient/create';
import { CreateRecipientUseCase } from 'src/domain/deliveries/application/use-cases/recipient/create-recipient';
import { GetRecipientController } from './controllers/recipient/get';
import { GetRecipientUseCase } from 'src/domain/deliveries/application/use-cases/recipient/get-recipient';

@Module({
  imports: [DatabaseModule, CryptographyModule],
  controllers: [
    CreateAccountController,
    AuthenticateController,
    UpdateDeliveryManController,
    GetDeliveryManController,
    DeleteDeliveryManController,
    CreateRecipientController,
    GetRecipientController,
  ],
  providers: [
    RegisterDeliveryManUseCase,
    AuthenticateDeliveryManUseCase,
    UpdateDeliveryManUseCase,
    GetDeliveryManUseCase,
    DeleteDeliveryManUseCase,
    CreateRecipientUseCase,
    GetRecipientUseCase,
  ],
})
export class HttpModule {}
