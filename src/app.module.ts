import { Module } from '@nestjs/common';
import { createObserveModule } from '@nestjs/observe';
import { PrismaService } from './prisma/prisma.service.js';
import { CreateAccountController } from './controllers/create-account.controller.js';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { envSchema } from './env.js';

export const { ObserveModule, ObserveInstrument } = createObserveModule();

@Module({
  imports: [
    ConfigModule.forRoot({
      validate: (env) => envSchema.parse(env),
      isGlobal: true,
    }),
  ],
  providers: [PrismaService],
  controllers: [CreateAccountController],
})
export class AppModule {}
