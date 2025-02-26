import { AppModule } from 'src/infra/app.module';
import { PrismaService } from 'src/infra/database/prisma/prisma.service';
import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import request from 'supertest';
import { makeDeliveryMan } from 'test/factories/makeDeliveryMan';
import { PrismaDeliveryManMapper } from 'src/infra/database/prisma/mappers/prisma-delivery-man-mapper';
import { JwtService } from '@nestjs/jwt';
import { PrismaRecipientMapper } from 'src/infra/database/prisma/mappers/prisma-recipient-mapper';
import { makeRecipient } from 'test/factories/makeRecipient';
import { RecipientProps } from 'src/domain/deliveries/enterprise/entities/recipient';

interface bodyResponse {
  recipients: RecipientProps[];
}

describe('Get All Recipients (E2E)', () => {
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

  it('[GET] /recipients', async () => {
    const deliveryMan = makeDeliveryMan();
    // const recipient = makeRecipient();
    await prisma.user.create({
      data: PrismaDeliveryManMapper.toPrisma(deliveryMan),
    });
    await prisma.recipient.create({
      data: PrismaRecipientMapper.toPrisma(
        makeRecipient({
          cpf: '123123123',
        }),
      ),
    });
    await prisma.recipient.create({
      data: PrismaRecipientMapper.toPrisma(
        makeRecipient({
          cpf: '456456456',
        }),
      ),
    });
    await prisma.recipient.create({
      data: PrismaRecipientMapper.toPrisma(
        makeRecipient({
          cpf: '789789789',
        }),
      ),
    });
    await prisma.recipient.create({
      data: PrismaRecipientMapper.toPrisma(
        makeRecipient({
          cpf: '324234234',
        }),
      ),
    });

    const accessToken = jwt.sign({
      sub: deliveryMan.id.toString(),
      role: deliveryMan.role,
    });
    const response = await request(app.getHttpServer())
      .get(`/recipients`)
      .set('Authorization', `Bearer ${accessToken}`);

    expect(response.statusCode).toBe(200);

    expect((response.body as bodyResponse).recipients).toHaveLength(4);
  });
});
