import { DatabaseModule } from './../database/database.module';
import { Module } from '@nestjs/common';
import { CreateAccountController } from './controllers/create-account';
import { AuthenticateController } from './controllers/authenticate';
import { RegisterDeliveryManUseCase } from 'src/domain/deliveries/application/use-cases/delivery-man/register-delivery-man';
import { AuthenticateDeliveryManUseCase } from 'src/domain/deliveries/application/use-cases/delivery-man/authenticate-delivery-man';
import { CryptographyModule } from '../cryptography/cryptography.module';

@Module({
  imports: [DatabaseModule, CryptographyModule],
  controllers: [CreateAccountController, AuthenticateController],
  providers: [RegisterDeliveryManUseCase, AuthenticateDeliveryManUseCase],
})
export class HttpModule {}
