import { AppModule } from 'src/infra/app.module';
import { PrismaService } from 'src/infra/database/prisma/prisma.service';
import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import request from 'supertest';
import { makeDeliveryMan } from 'test/factories/makeDeliveryMan';
import { PrismaDeliveryManMapper } from 'src/infra/database/prisma/mappers/prisma-delivery-man-mapper';
import { JwtService } from '@nestjs/jwt';
import { DeliveryManProps } from 'src/domain/deliveries/enterprise/entities/delivery-man';

interface bodyResponse {
  users: DeliveryManProps[];
}

describe('Get All Users (E2E)', () => {
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

  it('[GET] /users', async () => {
    const deliveryMan = makeDeliveryMan();
    await prisma.user.create({
      data: PrismaDeliveryManMapper.toPrisma(deliveryMan),
    });
    await prisma.user.create({
      data: PrismaDeliveryManMapper.toPrisma(
        makeDeliveryMan({
          cpf: '123123',
        }),
      ),
    });
    await prisma.user.create({
      data: PrismaDeliveryManMapper.toPrisma(
        makeDeliveryMan({
          cpf: '456456',
        }),
      ),
    });
    await prisma.user.create({
      data: PrismaDeliveryManMapper.toPrisma(
        makeDeliveryMan({
          cpf: '789789',
        }),
      ),
    });
    const accessToken = jwt.sign({
      sub: deliveryMan.id.toString(),
      role: deliveryMan.role,
    });
    const response = await request(app.getHttpServer())
      .get(`/users?page=1`)
      .set('Authorization', `Bearer ${accessToken}`);

    expect(response.statusCode).toBe(200);

    expect((response.body as bodyResponse).users).toHaveLength(4);
  });
});
