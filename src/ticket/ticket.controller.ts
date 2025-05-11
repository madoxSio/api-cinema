import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, } from '@nestjs/common';
import { TicketService } from './ticket.service';
import { CreateTicketDto, CreateTicketUsageDto } from './dto/create-ticket.dto';
import { UpdateTicketDto } from './dto/update-ticket.dto';
import { JwtAuthGuard } from '../auth/guards/jwt.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '@prisma/client';
import { CurrentUser, JwtUser } from 'src/auth/decorators/current-user.decorator';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';


@ApiTags('Tickets')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('ticket')
export class TicketController {
  constructor(private readonly ticketService: TicketService) {}

  @ApiOperation({ summary: 'Buy a ticket (STANDARD or SUPER)' })
  @ApiResponse({ status: 201, description: 'Ticket successfully purchased' })
  @ApiResponse({ status: 400, description: 'Insufficient funds or invalid data' })
  @Post()
  create(@Body() createTicketDto: CreateTicketDto) {
    return this.ticketService.create(createTicketDto);
  }

  @Roles(Role.ADMIN)
  @Get()
  @ApiOperation({ summary: 'List all tickets (admin only)' })
  @ApiResponse({ status: 200, description: 'List of all tickets' })
  findAll() {
    return this.ticketService.findAll();
  }

  @Get('me/:id')
  @ApiOperation({ summary: 'Retrieve one of your own tickets by ID' })
  @ApiResponse({ status: 200, description: 'Ticket retrieved successfully' })
  @ApiResponse({ status: 403, description: 'Ticket does not belong to user' })
  @ApiParam({ name: 'id', type: Number, description: 'Ticket ID' })
  findOne(@CurrentUser() user: JwtUser, @Param('id') id: string) {
    return this.ticketService.findOne(user.sub ,+id);
  }

  @Roles(Role.ADMIN)
  @Get(':userId/:id')
  @ApiOperation({ summary: 'Retrieve a user\'s ticket by ID (admin only)' })
  @ApiResponse({ status: 200, description: 'Ticket retrieved successfully' })
  @ApiParam({ name: 'userId', type: String, description: 'User ID' })
  @ApiParam({ name: 'id', type: Number, description: 'Ticket ID' })
  adminFindOne(@Param('userId') userId: string, @Param('id') id: string) {
    return this.ticketService.findOne(userId ,+id);
  }

  @Post('me/usage')
  @ApiOperation({ summary: 'Use a ticket to access a screening' })
  @ApiResponse({ status: 201, description: 'Ticket usage recorded successfully' })
  @ApiResponse({ status: 400, description: 'Invalid usage (e.g., screening full, already used, etc.)' })
  @ApiBody({ type: CreateTicketUsageDto })
  createTicketUsage(
    @CurrentUser() user: JwtUser,
    @Body() createTicketUsageDto: CreateTicketUsageDto,
  ) {
    return this.ticketService.createTicketUsage(user.sub, createTicketUsageDto);
  }
}
