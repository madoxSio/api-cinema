import { Injectable, Logger, NotFoundException, BadRequestException } from '@nestjs/common';
import { CreateTicketDto, CreateTicketUsageDto } from './dto/create-ticket.dto';
import { UpdateTicketDto } from './dto/update-ticket.dto';
import { PrismaService } from '../prisma.service';

@Injectable()
export class TicketService {
  private readonly logger = new Logger(TicketService.name);
  constructor(private prisma: PrismaService) {}
  
  async create(createTicketDto: CreateTicketDto) {
    this.logger.log('Creating ticket', createTicketDto);
    return await this.prisma.ticket.create({
      data: {
        userId: createTicketDto.userId,
        type: createTicketDto.type,
      },
    });
  }

  async findAll() {
    return await this.prisma.ticket.findMany();
  }

  async findOne(id: number) {
    const ticket = await this.prisma.ticket.findUnique({
      where: { id },
    });
    
    if (!ticket) {
      this.logger.warn('Ticket not found', id);
      throw new NotFoundException('Ticket not found');
    }
    return ticket;
  }
  
  async createTicketUsage(ticketUsageDto: CreateTicketUsageDto, ticketId: number) {
    this.logger.log('Creating ticket usage', JSON.stringify(ticketUsageDto));
    const ticket = await this.prisma.ticket.findUnique({
      where: { id: ticketId },
    });
    if (!ticket) {
      this.logger.warn('Ticket not found', ticketId);
      throw new NotFoundException('Ticket not found');
    }

    const screening = await this.prisma.screening.findUnique({
      where: { id: ticketUsageDto.screeningId },
    });
    if (!screening) {
      this.logger.warn('Screening not found', ticketUsageDto.screeningId);
      throw new NotFoundException('Screening not found');
    }

    if(ticket.type === 'STANDARD'){
      const ticketUsage = await this.prisma.ticketUsage.findFirst({
        where: {
          ticketId: ticketId,
        },
      });
      if (ticketUsage) {
        this.logger.warn('A standard ticket can only be used once', ticketId);
        throw new BadRequestException('A standard ticket can only be used once');
      }
    }
    else{
      const ticketUsages = await this.prisma.ticketUsage.findMany({
        where: {
          ticketId: ticketId,
        },
      });
      if (ticketUsages && ticketUsages.length >= 10) {
        this.logger.warn('A super ticket can only be used 10 times', ticketId);
        throw new BadRequestException('A super ticket can only be used 10 times');
      }
      const alreadyUsed = ticketUsages.find(u => u.screeningId === ticketUsageDto.screeningId);
      if (alreadyUsed) {
        this.logger.warn('Ticket usage already exists', ticketId);
        throw new BadRequestException('Ticket usage already exists');
      }
    }
    return await this.prisma.ticketUsage.create({
      data: {
        ticketId: ticketId,
        screeningId: ticketUsageDto.screeningId,
      },
    });
  }

  update(id: number, updateTicketDto: UpdateTicketDto) {
    return `This action updates a #${id} ticket`;
  }

  remove(id: number) {
    return `This action removes a #${id} ticket`;
  }
}
