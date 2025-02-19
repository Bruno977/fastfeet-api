import { AppModule } from 'src/infra/app.module';
import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import request from 'supertest';
import { hash } from 'bcryptjs';
import { makeDeliveryMan } from 'test/factories/makeDeliveryMan';
import { PrismaService } from 'src/infra/database/prisma/prisma.service';
import { PrismaDeliveryManMapper } from 'src/infra/database/prisma/mappers/prisma-delivery-man-mapper';

describe('Authenticate user (E2E)', () => {
  let app: INestApplication;
  let primaService: PrismaService;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleRef.createNestApplication();
    primaService = moduleRef.get(PrismaService);

    await app.init();
  });

  it('[POST] /sessions', async () => {
    const deliveryMan = makeDeliveryMan({
      password: await hash('123456', 8),
    });
    await primaService.user.create({
      data: PrismaDeliveryManMapper.toPrisma(deliveryMan),
    });
    const response = await request(app.getHttpServer()).post('/sessions').send({
      cpf: deliveryMan.cpf,
      password: '123456',
    });
    expect(response.statusCode).toBe(201);
  });
});
