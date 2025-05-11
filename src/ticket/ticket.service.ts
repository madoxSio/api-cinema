import { Injectable, Logger, NotFoundException, BadRequestException } from '@nestjs/common';
import { CreateTicketDto, CreateTicketUsageDto } from './dto/create-ticket.dto';
import { UpdateTicketDto } from './dto/update-ticket.dto';
import { PrismaService } from '../prisma.service';

@Injectable()
export class TicketService {
  private readonly logger = new Logger(TicketService.name);

  private readonly ticketPrice: { [key: string]: number } = {
    STANDARD: 8.00,
    SUPER: 50.00,
  };
  constructor(private prisma: PrismaService) {}
  
  async create(createTicketDto: CreateTicketDto) {
    this.logger.log('Creating ticket', createTicketDto);

    const price = this.ticketPrice[createTicketDto.type];

    return await this.prisma.$transaction(async (tx) => {
      const user = await tx.user.findUnique({
        where: { id: createTicketDto.userId },
      });

      if (!user) {
        this.logger.warn('User not found', createTicketDto.userId);
        throw new NotFoundException('User not found');
      }

      if (user.balance < price) {
        this.logger.warn('Insufficient funds for ticket', createTicketDto.userId);
        throw new BadRequestException('Insufficient funds for ticket');
      }

      const ticket = await tx.ticket.create({
        data: {
          userId: createTicketDto.userId,
          type: createTicketDto.type,
        },
      });

      await tx.transaction.create({
        data: {
          userId: createTicketDto.userId,
          amount: -price,
          type: 'PURCHASE',
        },
      });

      await tx.user.update({
        where: { id: createTicketDto.userId },
        data: {
          balance: { decrement: price },
        },
      });

      return ticket;
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
