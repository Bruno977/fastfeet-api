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

describe('Deliver Order (E2E)', () => {
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

  // s3 free 14 Days,
  it('[POST] /orders/:orderId/attachments', async () => {
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
    // const response = await request(app.getHttpServer())
    //   .post(`/orders/${order.id.toString()}/attachments`)
    //   .set('Authorization', `Bearer ${accessToken}`)
    //   .attach('file', './test/e2e/teste.jpg');
    // expect(response.statusCode).toBe(201);
  });
});
