import { Module } from '@nestjs/common';
import { createObserveModule } from '@nestjs/observe';
import { PrismaService } from './prisma/prisma.service.js';
import { CreateAccountController } from './controllers/create-account.controller.js';

export const { ObserveModule, ObserveInstrument } = createObserveModule();

@Module({
  providers: [PrismaService],
  controllers: [CreateAccountController],
})
export class AppModule {}
