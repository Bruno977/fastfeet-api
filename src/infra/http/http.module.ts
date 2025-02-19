import { DatabaseModule } from './../database/database.module';
import { Module } from '@nestjs/common';
import { CreateAccountController } from './controllers/delivery-man/create-account';
import { AuthenticateController } from './controllers/delivery-man/authenticate';
import { RegisterDeliveryManUseCase } from 'src/domain/deliveries/application/use-cases/delivery-man/register-delivery-man';
import { AuthenticateDeliveryManUseCase } from 'src/domain/deliveries/application/use-cases/delivery-man/authenticate-delivery-man';
import { CryptographyModule } from '../cryptography/cryptography.module';
import { UpdateDeliveryManController } from './controllers/delivery-man/update';
import { UpdateDeliveryManUseCase } from 'src/domain/deliveries/application/use-cases/delivery-man/update-delivery-man';

@Module({
  imports: [DatabaseModule, CryptographyModule],
  controllers: [
    CreateAccountController,
    AuthenticateController,
    UpdateDeliveryManController,
  ],
  providers: [
    RegisterDeliveryManUseCase,
    AuthenticateDeliveryManUseCase,
    UpdateDeliveryManUseCase,
  ],
})
export class HttpModule {}
