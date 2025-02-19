import { AppModule } from 'src/infra/app.module';
import { PrismaService } from 'src/infra/database/prisma/prisma.service';
import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import request from 'supertest';
import { makeDeliveryMan } from 'test/factories/makeDeliveryMan';
import { PrismaDeliveryManMapper } from 'src/infra/database/prisma/mappers/prisma-delivery-man-mapper';
import { JwtService } from '@nestjs/jwt';

describe('Create Account (E2E)', () => {
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

  it('[PUT] /update-user/:id', async () => {
    const deliveryMan = makeDeliveryMan();
    await prisma.user.create({
      data: PrismaDeliveryManMapper.toPrisma(deliveryMan),
    });
    const accessToken = jwt.sign({
      sub: deliveryMan.id.toString(),
      role: deliveryMan.role,
    });
    const response = await request(app.getHttpServer())
      .put(`/update-user/${deliveryMan.id.toString()}`)
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        name: 'John Doe updated',
      });
    expect(response.statusCode).toBe(204);

    const deliveryManOnDatabase = await prisma.user.findFirst({
      where: {
        name: 'John Doe updated',
      },
    });
    expect(deliveryManOnDatabase).toBeTruthy();
  });
});
