import { Module } from '@nestjs/common';
import { PrismaService } from './prisma/prisma.service';
import { PrismaDeliveryManRepository } from './prisma/repositories/prisma-delivery-man-repository';
import { DeliveryManRepository } from 'src/domain/deliveries/application/repositories/delivery-man-repository';

@Module({
  providers: [
    PrismaService,
    {
      provide: DeliveryManRepository,
      useClass: PrismaDeliveryManRepository,
    },
  ],
  exports: [PrismaService, DeliveryManRepository],
})
export class DatabaseModule {}
