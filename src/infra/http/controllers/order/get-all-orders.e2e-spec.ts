import { AppModule } from 'src/infra/app.module';
import { PrismaService } from 'src/infra/database/prisma/prisma.service';
import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import request from 'supertest';
import { makeDeliveryMan } from 'test/factories/makeDeliveryMan';
import { PrismaDeliveryManMapper } from 'src/infra/database/prisma/mappers/prisma-delivery-man-mapper';
import { JwtService } from '@nestjs/jwt';
import { OrderProps } from 'src/domain/deliveries/enterprise/entities/order';
import { makeOrder } from 'test/factories/makeOrder';
import { PrismaOrderMapper } from 'src/infra/database/prisma/mappers/prisma-order-mapper';
import { PrismaRecipientMapper } from 'src/infra/database/prisma/mappers/prisma-recipient-mapper';
import { makeRecipient } from 'test/factories/makeRecipient';

interface bodyResponse {
  orders: OrderProps[];
}

describe('Get All Orders (E2E)', () => {
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

  it('[GET] /orders', async () => {
    const deliveryMan = makeDeliveryMan();
    const recipient = makeRecipient();
    await prisma.user.create({
      data: PrismaDeliveryManMapper.toPrisma(deliveryMan),
    });
    await prisma.recipient.create({
      data: PrismaRecipientMapper.toPrisma(recipient),
    });
    await prisma.order.create({
      data: PrismaOrderMapper.toPrisma(
        makeOrder({
          deliveryManId: deliveryMan.id,
          recipientId: recipient.id,
        }),
      ),
    });
    await prisma.order.create({
      data: PrismaOrderMapper.toPrisma(
        makeOrder({
          deliveryManId: deliveryMan.id,
          recipientId: recipient.id,
        }),
      ),
    });
    await prisma.order.create({
      data: PrismaOrderMapper.toPrisma(
        makeOrder({
          deliveryManId: deliveryMan.id,
          recipientId: recipient.id,
        }),
      ),
    });
    await prisma.order.create({
      data: PrismaOrderMapper.toPrisma(
        makeOrder({
          deliveryManId: deliveryMan.id,
          recipientId: recipient.id,
        }),
      ),
    });

    const accessToken = jwt.sign({
      sub: deliveryMan.id.toString(),
      role: deliveryMan.role,
    });
    const response = await request(app.getHttpServer())
      .get(`/orders?page=1`)
      .set('Authorization', `Bearer ${accessToken}`);

    expect(response.statusCode).toBe(200);

    expect((response.body as bodyResponse).orders).toHaveLength(4);
  });
});
