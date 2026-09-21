import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';
import { PrismaService } from '@/prisma/prisma.service.js';
import { JwtAuthGuard } from '@/auth/jwt-auth.guard.js';
import { CurrentUser } from '@/auth/current-user-decorator.js';
import type { userPayload } from '@/auth/jwt.strategy.js';
import { z } from 'zod';
import { ZodValidationPipe } from '@/pipes/zod-validation-pipe.js';

const createQuestionBodySchema = z.object({
  title: z.string(),
  content: z.string(),
});

type CreateQuestionBodySchema = z.infer<typeof createQuestionBodySchema>;

@Controller('/questions')
@UseGuards(JwtAuthGuard)
export class QuestionsController {
  constructor(private prisma: PrismaService) {}

  @Post()
  async handle(
    @CurrentUser() user: userPayload,
    @Body(new ZodValidationPipe(createQuestionBodySchema))
    body: CreateQuestionBodySchema,
  ) {
    const { title, content } = body;
    const { sub } = user;

    const slug = this.convertToSlug(title);

    const question = await this.prisma.question.create({
      data: {
        content,
        title,
        authorId: sub,
        slug,
      },
    });

    return {
      question,
    };
  }

  private convertToSlug(title: string): string {
    return title
      .toLowerCase()
      .trim()
      .replace(/[\s\W-]+/g, '-')
      .replace(/^-+|-+$/g, '');
  }
}
