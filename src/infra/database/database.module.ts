import { Module } from '@nestjs/common';
import { PrismaService } from './prisma/prisma.service';
import { PrismaDeliveryManRepository } from './prisma/repositories/prisma-delivery-man-repository';
import { DeliveryManRepository } from 'src/domain/deliveries/application/repositories/delivery-man-repository';
import { RecipientRepository } from 'src/domain/deliveries/application/repositories/recipient-repository';
import { PrismaRecipientRepository } from './prisma/repositories/prisma-recipient-repository';

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
  ],
  exports: [PrismaService, DeliveryManRepository, RecipientRepository],
})
export class DatabaseModule {}
