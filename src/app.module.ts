import { Module } from '@nestjs/common';
import { createObserveModule } from '@nestjs/observe';
import { PrismaService } from '@/prisma/prisma.service.js';
import { CreateAccountController } from '@/controllers/create-account.controller.js';
import { ConfigModule } from '@nestjs/config';
import { envSchema } from '@/env.js';
import { AuthModule } from '@/auth/auth.module.js';
import { AuthenticateController } from '@/controllers/authenticate.controller.js';
import { QuestionsController } from '@/controllers/create-question.controller.js';
import { FetchRecentQuestionsController } from '@/controllers/fetch-recent-questions.controller.js';

export const { ObserveModule, ObserveInstrument } = createObserveModule();

@Module({
  imports: [
    ConfigModule.forRoot({
      validate: (env) => envSchema.parse(env),
      isGlobal: true,
    }),
    AuthModule,
  ],
  providers: [PrismaService],
  controllers: [
    CreateAccountController,
    AuthenticateController,
    QuestionsController,
    FetchRecentQuestionsController,
  ],
})
export class AppModule {}
