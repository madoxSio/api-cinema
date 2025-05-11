import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { PrismaService } from '../prisma.service';
import { MoneyService } from 'src/money/money.service';

@Module({
  controllers: [UsersController],
  providers: [UsersService, PrismaService, MoneyService],
  exports: [UsersService],
})
export class UsersModule {}
