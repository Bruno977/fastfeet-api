import { Module } from '@nestjs/common';
import { PrismaService } from './prisma/prisma.service';
import { PrismaDeliveryManRepository } from './prisma/repositories/prisma-delivery-man-repository';
import { DeliveryManRepository } from 'src/domain/deliveries/application/repositories/delivery-man-repository';
import { RecipientRepository } from 'src/domain/deliveries/application/repositories/recipient-repository';
import { PrismaRecipientRepository } from './prisma/repositories/prisma-recipient-repository';
import { OrderRepository } from 'src/domain/deliveries/application/repositories/order-repository';
import { PrismaOrderRepository } from './prisma/repositories/prisma-order-repository';
import { AttachmentRepository } from 'src/domain/deliveries/application/repositories/attachments-repository';
import { PrismaAttachmentsRepository } from './prisma/repositories/prisma-attachments-repository';

@Module({
  providers: [
    PrismaService,
    {
      provide: DeliveryManRepository,
      useClass: PrismaDeliveryManRepository,
    },
    {
      provide: RecipientRepository,
      useClass: PrismaRecipientRepository,
    },
    {
      provide: OrderRepository,
      useClass: PrismaOrderRepository,
    },
    {
      provide: AttachmentRepository,
      useClass: PrismaAttachmentsRepository,
    },
  ],
  exports: [
    PrismaService,
    DeliveryManRepository,
    RecipientRepository,
    OrderRepository,
    AttachmentRepository,
  ],
})
export class DatabaseModule {}
