import { AppModule } from 'src/infra/app.module';
import { PrismaService } from 'src/infra/database/prisma/prisma.service';
import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import request from 'supertest';
import { makeDeliveryMan } from 'test/factories/makeDeliveryMan';
import { PrismaDeliveryManMapper } from 'src/infra/database/prisma/mappers/prisma-delivery-man-mapper';
import { JwtService } from '@nestjs/jwt';
import { makeOrder } from 'test/factories/makeOrder';
import { PrismaOrderMapper } from 'src/infra/database/prisma/mappers/prisma-order-mapper';
import { makeRecipient } from 'test/factories/makeRecipient';
import { PrismaRecipientMapper } from 'src/infra/database/prisma/mappers/prisma-recipient-mapper';

describe('Get Order Nearby (E2E)', () => {
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

  it('[GET] /orders/nearby', async () => {
    const deliveryMan = makeDeliveryMan();

    const recipient1 = makeRecipient({
      cpf: '123123',
    });
    const recipient2 = makeRecipient({
      cpf: '456456',
    });

    recipient1.address.latitude = -22.92445;
    recipient1.address.longitude = -43.171343;

    recipient2.address.latitude = -23.000143;
    recipient2.address.longitude = -43.269481;

    await prisma.user.create({
      data: PrismaDeliveryManMapper.toPrisma(deliveryMan),
    });
    await prisma.recipient.create({
      data: PrismaRecipientMapper.toPrisma(recipient1),
    });
    await prisma.recipient.create({
      data: PrismaRecipientMapper.toPrisma(recipient2),
    });

    await prisma.order.create({
      data: PrismaOrderMapper.toPrisma(
        makeOrder({
          recipientId: recipient1.id,
          deliveryManId: deliveryMan.id,
        }),
      ),
    });
    await prisma.order.create({
      data: PrismaOrderMapper.toPrisma(
        makeOrder({
          recipientId: recipient1.id,
          deliveryManId: deliveryMan.id,
        }),
      ),
    });
    await prisma.order.create({
      data: PrismaOrderMapper.toPrisma(
        makeOrder({
          recipientId: recipient2.id,
          deliveryManId: deliveryMan.id,
        }),
      ),
    });
    const accessToken = jwt.sign({
      sub: deliveryMan.id.toString(),
      role: deliveryMan.role,
    });
    const response = await request(app.getHttpServer())
      .get(`/orders/nearby?latitude=-22.932381&longitude=-43.173639`)
      .set('Authorization', `Bearer ${accessToken}`);

    expect(response.statusCode).toBe(200);

    expect(response.body).toEqual(
      expect.objectContaining({
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        orders: expect.arrayContaining([
          expect.objectContaining({
            recipient_id: recipient1.id.toString(),
          }),
          expect.objectContaining({
            recipient_id: recipient1.id.toString(),
          }),
        ]),
      }),
    );
  });
});
