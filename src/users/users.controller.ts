import {
  Controller,
  Get,
  Body,
  Patch,
  Param,
  UseGuards,
  Delete,
  HttpCode,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { JwtAuthGuard } from '../auth/guards/jwt.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import {
  ApiOkResponse,
  ApiOperation,
  ApiProperty,
  ApiResponse,
} from '@nestjs/swagger';
import { User } from './entities/user.entity';
import { Role } from '@prisma/client';

// @UseGuards(JwtAuthGuard, RolesGuard)
// @Roles(Role.ADMIN)
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  @ApiOkResponse({
    description: 'Get all users',
    type: [User],
  })
  @ApiOperation({
    summary: 'Get all users',
    description: 'This endpoint retrieves all users.',
  })
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
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(id, updateUserDto);
  }

  @Get(':id/tickets/usages')
  async getMyTicketUsages(@Param('id') id: string) {
    return this.usersService.findAllTicketUsages(id);
  }
}
