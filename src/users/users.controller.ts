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
  ApiBearerAuth,
  ApiParam,
  ApiBody,
} from '@nestjs/swagger';
import { User } from './entities/user.entity';
import { Role } from '@prisma/client';
import { CurrentUser, JwtUser } from 'src/auth/decorators/current-user.decorator';

@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
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
  @Roles(Role.SUPER_ADMIN)
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(id, updateUserDto);
  }

  @Get('me/tickets/usages')
  @ApiOperation({ summary: 'Get ticket usages for current user' })
  @ApiResponse({ status: 200, description: 'List of ticket usages' })
  getMyTicketUsages(@CurrentUser() user: JwtUser) {
    return this.usersService.findAllTicketUsages(user.sub);
  }

  @Roles(Role.ADMIN)
  @Get(':id/tickets/usages')
  @ApiOperation({ summary: 'Get ticket usages for a specific user (admin only)' })
  @ApiParam({ name: 'id', description: 'User ID' })
  @ApiResponse({ status: 200, description: 'List of ticket usages' })
  getTicketUsages(@Param('id') id: string) {
    return this.usersService.findAllTicketUsages(id);
  }

  @Post('me/deposit')
  @ApiOperation({ summary: 'Deposit money into your account' })
  @ApiResponse({ status: 201, description: 'Deposit successful, new balance returned' })
  deposit(@CurrentUser() user: JwtUser, @Body() body: MoneyActionDto) {
    return this.moneyService.deposit(user.sub, body.amount);
  }

  @Roles(Role.ADMIN)
  @Post(':id/deposit')
  @ApiOperation({ summary: 'Deposit money into a user account (admin only)' })
  @ApiParam({ name: 'id', description: 'User ID' })
  @ApiBody({ type: MoneyActionDto })
  @ApiResponse({ status: 201, description: 'Deposit successful, new balance returned' })
  adminDeposit(@Param('id') id: string, @Body() body: MoneyActionDto) {
    return this.moneyService.deposit(id, body.amount);
  }

  @Post('me/withdraw')
  @ApiOperation({ summary: 'Withdraw money from your account' })
  @ApiResponse({ status: 201, description: 'Withdrawal successful, new balance returned' })
  @ApiResponse({ status: 400, description: 'Insufficient funds' })
  @ApiBody({ type: MoneyActionDto })
  withdraw(@CurrentUser() user: JwtUser, @Body() body: MoneyActionDto) {
    return this.moneyService.withdraw(user.sub, body.amount);
  }

  @Roles(Role.ADMIN)
  @Post(':id/withdraw')
  @ApiOperation({ summary: 'Withdraw money from a user account (admin only)' })
  @ApiParam({ name: 'id', description: 'User ID' })
  @ApiBody({ type: MoneyActionDto })
  @ApiResponse({ status: 201, description: 'Withdrawal successful, new balance returned' })
  adminWithdraw(@Param('id') id: string, @Body() body: MoneyActionDto) {
    return this.moneyService.withdraw(id, body.amount);
  }

  @Get('me/balance')
  @ApiOperation({ summary: 'Get your current balance' })
  @ApiResponse({ status: 200, description: 'User balance returned' })
  getMyBalance(@CurrentUser() user: JwtUser) {
    return this.moneyService.getBalance(user.sub);
  }

  @Roles(Role.ADMIN)
  @Get(':id/balance')
  @ApiOperation({ summary: 'Get the balance of a specific user (admin only)' })
  @ApiParam({ name: 'id', description: 'User ID' })
  @ApiResponse({ status: 200, description: 'User balance returned' })
  getBalance(@Param('id') id: string) {
    return this.moneyService.getBalance(id);
  }

  @Get('me/transactions')
  @ApiOperation({ summary: 'Get your transaction history' })
  @ApiResponse({ status: 200, description: 'List of transactions' })
  getMyTransactions(@CurrentUser() user: JwtUser) {
    return this.moneyService.getTransactions(user.sub);
  }

  @Roles(Role.ADMIN)
  @Get(':id/transactions')
  @ApiOperation({ summary: 'Get transaction history of a specific user (admin only)' })
  @ApiParam({ name: 'id', description: 'User ID' })
  @ApiResponse({ status: 200, description: 'List of transactions' })
  getTransactions(@Param('id') id: string) {
    return this.moneyService.getTransactions(id);
  }
}