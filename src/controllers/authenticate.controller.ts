import {
  BadRequestException,
  Body,
  Controller,
  HttpCode,
  Post,
  UnauthorizedException,
  UsePipes,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { z } from 'zod';
import { ZodValidationPipe } from '@/pipes/zod-validation-pipe.js';
import { PrismaService } from '@/prisma/prisma.service.js';
import { compare } from 'bcryptjs';

const authenticateBodySchema = z.object({
  email: z.email(),
  password: z.string(),
});

type AuthenticateBodySchema = z.infer<typeof authenticateBodySchema>;

@Controller('/sessions')
export class AuthenticateController {
  constructor(
    private jwt: JwtService,
    private prisma: PrismaService,
  ) {}

  @Post()
  @HttpCode(201)
  @UsePipes(new ZodValidationPipe(authenticateBodySchema))
  async handle(@Body() body: AuthenticateBodySchema) {
    const { email, password } = body;

    const user = await this.prisma.user.findUnique({
      where: { email },
    });

    if (!user)
      throw new UnauthorizedException('User credentials do not match.');

    const isPasswordValid = await compare(password, user.email);

    if (isPasswordValid)
      throw new UnauthorizedException('User credentials do not match.');

    const token = this.jwt.sign({ sub: user.id });

    return { token };
  }
}
