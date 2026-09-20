import { Controller, Post, Req, UseGuards } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import { JwtAuthGuard } from '../auth/jwt-auth.guard.js';
import { CurrentUser } from '../auth/current-user-decorator.js';
import type { userPayload } from '../auth/jwt.strategy.js';

@Controller('/questions')
@UseGuards(JwtAuthGuard)
export class QuestionsController {
  constructor(private prisma: PrismaService) {}

  @Post()
  async handle(@CurrentUser() user: userPayload) {
    console.log(user)
    return {}
  }
}
