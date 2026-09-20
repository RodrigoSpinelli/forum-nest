import { Controller, Post, UseGuards } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import { JwtAuthGuard } from '../auth/jwt-auth.guard.js';

@Controller('/questions')
@UseGuards(JwtAuthGuard)
export class QuestionsController {
  constructor(private prisma: PrismaService) {}

  @Post()
  async handle() {
    return {}
  }
}
