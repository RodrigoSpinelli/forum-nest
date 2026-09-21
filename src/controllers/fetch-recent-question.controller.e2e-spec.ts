import type { PrismaService } from '@/prisma/prisma.service.js';
import type { INestApplication } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import request from 'supertest';

describe('Fetch recent question (E2E)', () => {
  let app: INestApplication;
  let prisma: PrismaService;
  let jwt: JwtService;

  beforeAll(async () => {
    const { Test } = await import('@nestjs/testing');
    const { AppModule } = await import('@/app.module.js');
    const { PrismaService } = await import('@/prisma/prisma.service.js');

    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleRef.createNestApplication();
    prisma = moduleRef.get(PrismaService);
    jwt = moduleRef.get(JwtService);

    await app.init();
  });

  test('[GET] /questions', async () => {
    const user = await prisma.user.create({
      data: {
        name: 'Rodrigo Spinelli',
        email: 'rodrigo@wtf.inf.br',
        password: '123456',
      },
    });

    const token = jwt.sign({ sub: user.id });

    await prisma.question.createMany({
      data: [
        {
          authorId: user.id,
          title: 'New question-01',
          content: 'Question content',
          slug: 'new-question-01',
        },
        {
          authorId: user.id,
          title: 'New question-02',
          content: 'Question content',
          slug: 'new-question-02',
        },
      ],
    });

    const response = await request(app.getHttpServer())
      .get('/questions')
      .set('Authorization', `Bearer ${token}`);

    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual({
      questions: [
        expect.objectContaining({ title: 'New question-01' }),
        expect.objectContaining({ title: 'New question-02' }),
      ],
    });
  });
});
