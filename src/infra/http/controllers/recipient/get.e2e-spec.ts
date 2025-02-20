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

describe('Get Recipient (E2E)', () => {
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

  it('[GET] /recipient/:id', async () => {
    const deliveryMan = makeDeliveryMan();
    const recipient = makeRecipient();
    await prisma.user.create({
      data: PrismaDeliveryManMapper.toPrisma(deliveryMan),
    });
    await prisma.recipient.create({
      data: PrismaRecipientMapper.toPrisma(recipient),
    });
    const accessToken = jwt.sign({
      sub: deliveryMan.id.toString(),
      role: deliveryMan.role,
    });
    const response = await request(app.getHttpServer())
      .get(`/recipient/${recipient.id.toString()}`)
      .set('Authorization', `Bearer ${accessToken}`);

    expect(response.statusCode).toBe(200);

    expect(response.body).toEqual(
      expect.objectContaining({
        recipient: {
          name: recipient.name,
          cpf: recipient.cpf,
          address: {
            city: recipient.address.city,
            latitude: recipient.address.latitude,
            longitude: recipient.address.longitude,
            neighborhood: recipient.address.neighborhood,
            number: recipient.address.number,
            state: recipient.address.state,
            street: recipient.address.street,
            zipCode: recipient.address.zipCode,
          },
        },
      }),
    );
  });
});
