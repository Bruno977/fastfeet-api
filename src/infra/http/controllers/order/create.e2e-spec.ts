import { AppModule } from 'src/infra/app.module';
import { PrismaService } from 'src/infra/database/prisma/prisma.service';
import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import request from 'supertest';
import { makeDeliveryMan } from 'test/factories/makeDeliveryMan';
import { PrismaDeliveryManMapper } from 'src/infra/database/prisma/mappers/prisma-delivery-man-mapper';
import { JwtService } from '@nestjs/jwt';
import { makeRecipient } from 'test/factories/makeRecipient';
import { PrismaRecipientMapper } from 'src/infra/database/prisma/mappers/prisma-recipient-mapper';

describe('Create Order (E2E)', () => {
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

  it('[POST] /orders', async () => {
    const deliveryMan = makeDeliveryMan();
    await prisma.user.create({
      data: PrismaDeliveryManMapper.toPrisma(deliveryMan),
    });
    const recipient = makeRecipient();
    await prisma.recipient.create({
      data: PrismaRecipientMapper.toPrisma(recipient),
    });
    const accessToken = jwt.sign({
      sub: deliveryMan.id.toString(),
      role: deliveryMan.role,
    });
    const response = await request(app.getHttpServer())
      .post('/orders')
      .send({
        description: 'Description',
        user_id: deliveryMan.id.toString(),
        recipient_id: recipient.id.toString(),
      })
      .set('Authorization', `Bearer ${accessToken}`);
    expect(response.statusCode).toBe(201);

    const orderOnDatabase = await prisma.order.findFirst();
    expect(orderOnDatabase?.user_id).toBe(deliveryMan.id.toString());
  });
});
