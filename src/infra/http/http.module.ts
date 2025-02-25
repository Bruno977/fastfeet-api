import { DatabaseModule } from './../database/database.module';
import { Module } from '@nestjs/common';
import { CreateAccountController } from './controllers/delivery-man/create-account';
import { AuthenticateController } from './controllers/delivery-man/authenticate-delivery-man';
import { RegisterDeliveryManUseCase } from 'src/domain/deliveries/application/use-cases/delivery-man/register-delivery-man';
import { AuthenticateDeliveryManUseCase } from 'src/domain/deliveries/application/use-cases/delivery-man/authenticate-delivery-man';
import { CryptographyModule } from '../cryptography/cryptography.module';
import { UpdateDeliveryManController } from './controllers/delivery-man/update-delivery-man';
import { UpdateDeliveryManUseCase } from 'src/domain/deliveries/application/use-cases/delivery-man/update-delivery-man';
import { GetDeliveryManController } from './controllers/delivery-man/get-delivery-man';
import { GetDeliveryManUseCase } from 'src/domain/deliveries/application/use-cases/delivery-man/get-delivery-man';
import { DeleteDeliveryManController } from './controllers/delivery-man/delete-delivery-man';
import { DeleteDeliveryManUseCase } from 'src/domain/deliveries/application/use-cases/delivery-man/delete-delivery-man';
import { CreateRecipientController } from './controllers/recipient/create';
import { CreateRecipientUseCase } from 'src/domain/deliveries/application/use-cases/recipient/create-recipient';
import { GetRecipientController } from './controllers/recipient/get';
import { GetRecipientUseCase } from 'src/domain/deliveries/application/use-cases/recipient/get-recipient';
import { UpdateRecipientController } from './controllers/recipient/update';
import { UpdateRecipientUseCase } from 'src/domain/deliveries/application/use-cases/recipient/update-recipient';
import { DeleteRecipientController } from './controllers/recipient/delete';
import { DeleteRecipientUseCase } from 'src/domain/deliveries/application/use-cases/recipient/delete-recipient';
import { CreateOrderController } from './controllers/order/create-order';
import { CreateOrderUseCase } from 'src/domain/deliveries/application/use-cases/order/create-order';
import { GetOrderController } from './controllers/order/get-order';
import { GetOrderUseCase } from 'src/domain/deliveries/application/use-cases/order/get-order';
import { DeleteOrderController } from './controllers/order/delete-order';
import { DeleteOrderUseCase } from 'src/domain/deliveries/application/use-cases/order/delete-order';
import { UpdateOrderController } from './controllers/order/update-order';
import { UpdateOrderUseCase } from 'src/domain/deliveries/application/use-cases/order/update-order';
import { FindManyNearbyUseCase } from 'src/domain/deliveries/application/use-cases/order/find-many-nearby';
import { GetOrdersNearbyController } from './controllers/order/get-orders-nearby';
import { GetOrderByUserUseCase } from 'src/domain/deliveries/application/use-cases/order/get-order-by-user';
import { GetOrdersByUserController } from './controllers/order/get-order-by-user';
import { StorageModule } from '../storage/storage.module';
import { DeliverOrderController } from './controllers/order/deliver-order';
import { DeliverOrderUseCase } from 'src/domain/deliveries/application/use-cases/order/deliver-order';
import { UpdateOrderStatusController } from './controllers/order/update-order-status';
import { UpdateOrderStatusUseCase } from 'src/domain/deliveries/application/use-cases/order/update-order-status';
@Module({
  imports: [DatabaseModule, CryptographyModule, StorageModule],
  controllers: [
    CreateAccountController,
    AuthenticateController,
    UpdateDeliveryManController,
    GetDeliveryManController,
    DeleteDeliveryManController,
    CreateRecipientController,
    GetRecipientController,
    UpdateRecipientController,
    DeleteRecipientController,
    CreateOrderController,
    GetOrderController,
    DeleteOrderController,
    UpdateOrderController,
    GetOrdersNearbyController,
    GetOrdersByUserController,
    DeliverOrderController,
    UpdateOrderStatusController,
  ],
  providers: [
    RegisterDeliveryManUseCase,
    AuthenticateDeliveryManUseCase,
    UpdateDeliveryManUseCase,
    GetDeliveryManUseCase,
    DeleteDeliveryManUseCase,
    CreateRecipientUseCase,
    GetRecipientUseCase,
    UpdateRecipientUseCase,
    DeleteRecipientUseCase,
    CreateOrderUseCase,
    GetOrderUseCase,
    DeleteOrderUseCase,
    UpdateOrderUseCase,
    FindManyNearbyUseCase,
    GetOrderByUserUseCase,
    DeliverOrderUseCase,
    UpdateOrderStatusUseCase,
  ],
})
export class HttpModule {}
