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
import { OrderProps } from 'src/domain/deliveries/enterprise/entities/order';

interface ResponseBody {
  orders: OrderProps[];
}

describe('Get Order By User (E2E)', () => {
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

  it('[GET] /users/:id/orders', async () => {
    const deliveryMan = makeDeliveryMan({
      cpf: '123123',
    });
    const deliveryMan2 = makeDeliveryMan({
      cpf: '321321',
    });

    const recipient = makeRecipient();
    await prisma.user.create({
      data: PrismaDeliveryManMapper.toPrisma(deliveryMan),
    });
    await prisma.user.create({
      data: PrismaDeliveryManMapper.toPrisma(deliveryMan2),
    });
    await prisma.recipient.create({
      data: PrismaRecipientMapper.toPrisma(recipient),
    });
    await prisma.order.create({
      data: PrismaOrderMapper.toPrisma(
        makeOrder({
          recipientId: recipient.id,
          deliveryManId: deliveryMan.id,
        }),
      ),
    });
    await prisma.order.create({
      data: PrismaOrderMapper.toPrisma(
        makeOrder({
          recipientId: recipient.id,
          deliveryManId: deliveryMan.id,
        }),
      ),
    });
    await prisma.order.create({
      data: PrismaOrderMapper.toPrisma(
        makeOrder({
          recipientId: recipient.id,
          deliveryManId: deliveryMan2.id,
        }),
      ),
    });
    const accessToken = jwt.sign({
      sub: deliveryMan.id.toString(),
      role: deliveryMan.role,
    });
    const response = await request(app.getHttpServer())
      .get(`/users/${deliveryMan.id.toString()}/orders`)
      .set('Authorization', `Bearer ${accessToken}`);

    expect(response.statusCode).toBe(200);

    expect((response.body as ResponseBody).orders).toHaveLength(2);
  });
});
