import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, } from '@nestjs/common';
import { TicketService } from './ticket.service';
import { CreateTicketDto, CreateTicketUsageDto } from './dto/create-ticket.dto';
import { UpdateTicketDto } from './dto/update-ticket.dto';
import { JwtAuthGuard } from '../auth/guards/jwt.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '@prisma/client';
import { CurrentUser, JwtUser } from 'src/auth/decorators/current-user.decorator';



@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('ticket')
export class TicketController {
  constructor(private readonly ticketService: TicketService) {}

  @Post()
  create(@Body() createTicketDto: CreateTicketDto) {
    return this.ticketService.create(createTicketDto);
  }

  @Roles(Role.ADMIN)
  @Get()
  findAll() {
    return this.ticketService.findAll();
  }

  @Get('me/:id')
  findOne(@CurrentUser() user: JwtUser, @Param('id') id: string) {
    return this.ticketService.findOne(user.sub ,+id);
  }

  @Roles(Role.ADMIN)
  @Get(':userId/:id')
  adminFindOne(@Param('userId') userId: string, @Param('id') id: string) {
    return this.ticketService.findOne(userId ,+id);
  }

  @Post('me/usage')
  createTicketUsage(
    @CurrentUser() user: JwtUser,
    @Body() createTicketUsageDto: CreateTicketUsageDto,
  ) {
    return this.ticketService.createTicketUsage(user.sub, createTicketUsageDto);
  }
}
