import { AppModule } from 'src/infra/app.module';
import { PrismaService } from 'src/infra/database/prisma/prisma.service';
import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import request from 'supertest';
import { JwtService } from '@nestjs/jwt';
import { makeDeliveryMan } from 'test/factories/makeDeliveryMan';
import { PrismaDeliveryManMapper } from 'src/infra/database/prisma/mappers/prisma-delivery-man-mapper';
import { makeRecipient } from 'test/factories/makeRecipient';
import { PrismaRecipientMapper } from 'src/infra/database/prisma/mappers/prisma-recipient-mapper';
import { faker } from '@faker-js/faker';

describe('Update Recipient (E2E)', () => {
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

  it('[PUT] /update-recipient/:id', async () => {
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
      .put(`/update-recipient/${recipient.id.toString()}`)
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        cpf: '123123123123',
        name: 'Nome Atualizado',
        address: {
          city: faker.location.city(),
          latitude: faker.location.latitude(),
          longitude: faker.location.longitude(),
          neighborhood: faker.location.country(),
          number: 123,
          state: faker.location.state(),
          street: faker.location.street(),
          zipCode: faker.location.zipCode(),
          role: 'ADMIN',
        },
      });
    expect(response.statusCode).toBe(204);

    const deliveryManOnDatabase = await prisma.recipient.findFirst({
      where: {
        name: 'Nome Atualizado',
      },
    });
    expect(deliveryManOnDatabase).toBeTruthy();
  });
});
