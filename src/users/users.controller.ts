import {
  Controller,
  Get,
  Body,
  Post,
  Patch,
  Param,
  UseGuards,
  Delete,
  HttpCode,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { MoneyService } from '../money/money.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { JwtAuthGuard } from '../auth/guards/jwt.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { MoneyActionDto } from '../money/dto/money-action.dto';
import {
  ApiOkResponse,
  ApiOperation,
  ApiProperty,
  ApiResponse,
} from '@nestjs/swagger';
import { User } from './entities/user.entity';
import { Role } from '@prisma/client';

@UseGuards(JwtAuthGuard, RolesGuard)
//@Roles(Role.ADMIN)
@Controller('users')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly moneyService: MoneyService
  ) {}

  @Get()
  @ApiOkResponse({
    description: 'Get all users',
    type: [User],
  })
  @ApiOperation({
    summary: 'Get all users',
    description: 'This endpoint retrieves all users.',
  })
  @Roles(Role.ADMIN)
  findAll() {
    return this.usersService.findAll();
  }

  @Get(':id')
  @ApiOkResponse({
    description: 'Get a user by ID',
    type: User,
  })
  @ApiOperation({
    summary: 'Get a user by ID',
    description: 'This endpoint retrieves a user by their unique ID.',
  })
  @Roles(Role.ADMIN)
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(id);
  }

  @Delete(':id')
  @HttpCode(204)
  @ApiResponse({
    status: 204,
    description: 'User deleted successfully',
    type: User,
  })
  @ApiOperation({
    summary: 'Delete a user by ID',
    description: 'This endpoint deletes a user by their unique ID.',
  })
  @Roles(Role.ADMIN)
  remove(@Param('id') id: string) {
    return this.usersService.remove(id);
  }

  @Patch(':id')
  @ApiProperty({
    description: 'Update a user by ID',
    type: UpdateUserDto,
  })
  @ApiOkResponse({
    description: 'Update a user by ID',
    type: User,
  })
  @ApiOperation({
    summary: 'Update a user by ID',
    description: 'This endpoint updates a user by their unique ID.',
  })
  @Roles(Role.ADMIN)
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(id, updateUserDto);
  }

  @Roles(Role.CLIENT, Role.ADMIN)
  @Get(':id/tickets/usages')
  getMyTicketUsages(@Param('id') id: string) {
    return this.usersService.findAllTicketUsages(id);
  }

  @Get(':id/balance')
  getBalance(@Param('id') id: string) {
    return this.moneyService.getBalance(id);
  }

  @Post(':id/deposit')
  deposit(@Param('id') id: string, @Body() body: MoneyActionDto) {
    return this.moneyService.deposit(id, body.amount);
  }

  @Post(':id/withdraw')
  withdraw(@Param('id') id: string, @Body() body: MoneyActionDto) {
    return this.moneyService.withdraw(id, body.amount);
  }
}
