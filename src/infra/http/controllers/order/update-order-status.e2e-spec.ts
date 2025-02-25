import { AppModule } from 'src/infra/app.module';
import { PrismaService } from 'src/infra/database/prisma/prisma.service';
import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import request from 'supertest';
import { JwtService } from '@nestjs/jwt';
import { makeDeliveryMan } from 'test/factories/makeDeliveryMan';
import { PrismaDeliveryManMapper } from 'src/infra/database/prisma/mappers/prisma-delivery-man-mapper';
import { makeOrder } from 'test/factories/makeOrder';
import { PrismaOrderMapper } from 'src/infra/database/prisma/mappers/prisma-order-mapper';
import { makeRecipient } from 'test/factories/makeRecipient';
import { PrismaRecipientMapper } from 'src/infra/database/prisma/mappers/prisma-recipient-mapper';

describe('Update Order Status (E2E)', () => {
  let app: INestApplication;
  let prisma: PrismaService;
  let jwt: JwtService;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();
    app = moduleRef.createNestApplication();
    prisma = moduleRef.get(PrismaService);
    jwt = moduleRef.get(JwtService);
    await app.init();
  });

  it('[PATCH] /orders/orderId/status', async () => {
    const deliveryMan = makeDeliveryMan();
    const recipient = makeRecipient();
    await prisma.user.create({
      data: PrismaDeliveryManMapper.toPrisma(deliveryMan),
    });
    await prisma.recipient.create({
      data: PrismaRecipientMapper.toPrisma(recipient),
    });

    const order = makeOrder({
      recipientId: recipient.id,
      deliveryManId: deliveryMan.id,
    });
    await prisma.order.create({
      data: PrismaOrderMapper.toPrisma(order),
    });
    const accessToken = jwt.sign({
      sub: deliveryMan.id.toString(),
      role: deliveryMan.role,
    });
    const response = await request(app.getHttpServer())
      .patch(`/orders/${order.id.toString()}/status`)
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        status: 'AWAITING_PICKUP',
      });

    expect(response.statusCode).toBe(204);

    const deliveryManOnDatabase = await prisma.order.findFirst({
      where: {
        id: order.id.toString(),
      },
    });
    expect(deliveryManOnDatabase?.status).toBe('AWAITING_PICKUP');
  });
});
