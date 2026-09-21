import type { PrismaService } from '@/prisma/prisma.service.js';
import type { INestApplication } from '@nestjs/common';
import { hash } from 'bcryptjs';
import request from 'supertest';

describe('Authenticate (E2E)', () => {
  let app: INestApplication;
  let prisma: PrismaService;

  beforeAll(async () => {
    const { Test } = await import('@nestjs/testing');
    const { AppModule } = await import('@/app.module.js');
    const { PrismaService } = await import('@/prisma/prisma.service.js');

    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleRef.createNestApplication();
    prisma = moduleRef.get(PrismaService);

    await app.init();
  });

  test('[POST] /sessions', async () => {
    await prisma.user.create({
      data: {
        name: 'Rodrigo Spinelli',
        email: 'rodrigo@wtf.inf.br',
        password: await hash('123456', 8),
      },
    });

    const response = await request(app.getHttpServer()).post('/sessions').send({
      email: 'rodrigo@wtf.inf.br',
      password: '123456',
    });

    expect(response.statusCode).toBe(201);
    expect(response.body).toEqual({
      token: expect.any(String),
    });
  });
});
