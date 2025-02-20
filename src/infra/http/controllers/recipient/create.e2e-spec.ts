import { AppModule } from 'src/infra/app.module';
import { PrismaService } from 'src/infra/database/prisma/prisma.service';
import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import request from 'supertest';
import { faker } from '@faker-js/faker';
import { makeDeliveryMan } from 'test/factories/makeDeliveryMan';
import { PrismaDeliveryManMapper } from 'src/infra/database/prisma/mappers/prisma-delivery-man-mapper';
import { JwtService } from '@nestjs/jwt';

describe('Create Recipient (E2E)', () => {
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

  it('[POST] /recipients', async () => {
    const deliveryMan = makeDeliveryMan();
    await prisma.user.create({
      data: PrismaDeliveryManMapper.toPrisma(deliveryMan),
    });
    const accessToken = jwt.sign({
      sub: deliveryMan.id.toString(),
      role: deliveryMan.role,
    });
    const response = await request(app.getHttpServer())
      .post('/recipients')
      .send({
        cpf: '123123123123',
        name: faker.person.fullName(),
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
      })
      .set('Authorization', `Bearer ${accessToken}`);
    expect(response.statusCode).toBe(201);
    const recipientOnDatabase = await prisma.recipient.findUnique({
      where: {
        cpf: '123123123123',
      },
    });
    expect(recipientOnDatabase).toBeTruthy();
  });
});
