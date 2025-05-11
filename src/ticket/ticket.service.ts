import { Injectable, Logger, NotFoundException, BadRequestException, ForbiddenException } from '@nestjs/common';
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
  
  async create(createTicketDto: CreateTicketDto, userId: string) {
    this.logger.log('Creating ticket', createTicketDto.type);

    const price = this.ticketPrice[createTicketDto.type];

    return await this.prisma.$transaction(async (tx) => {
      const user = await tx.user.findUnique({
        where: { id: userId },
      });

      if (!user) {
        this.logger.warn('User not found', userId);
        throw new NotFoundException('User not found');
      }

      if (user.balance < price) {
        this.logger.warn('Insufficient funds for ticket', userId);
        throw new BadRequestException('Insufficient funds for ticket');
      }

      const ticket = await tx.ticket.create({
        data: {
          userId: userId,
          type: createTicketDto.type,
        },
      });

      await tx.transaction.create({
        data: {
          userId: userId,
          amount: -price,
          type: 'PURCHASE',
        },
      });

      await tx.user.update({
        where: { id: userId },
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

  async findOne(userId:string, id: number) {
    const ticket = await this.prisma.ticket.findUnique({
      where: { id },
    });
    
    if (!ticket) {
      this.logger.warn('Ticket not found', id);
      throw new NotFoundException('Ticket not found');
    }
    if(ticket.userId !== userId){
      this.logger.warn('Ticket does not belong to user', ticket.id);
      throw new ForbiddenException('Ticket does not belong to user');
    }
    return ticket;
  }
  
  async createTicketUsage(userID: string, ticketUsageDto: CreateTicketUsageDto) {
    this.logger.log('Creating ticket usage', JSON.stringify(ticketUsageDto));
    const ticket = await this.prisma.ticket.findUnique({
      where: { id: ticketUsageDto.ticketId },
    });
    
    if (!ticket) {
      this.logger.warn('Ticket not found', ticketUsageDto.ticketId);
      throw new NotFoundException('Ticket not found');
    }
    if(ticket.userId !== userID){
      this.logger.warn('Ticket does not belong to user', ticketUsageDto.ticketId);
      throw new ForbiddenException('Ticket does not belong to user');
    }

    const screening = await this.prisma.screening.findUnique({
      where: { id: ticketUsageDto.screeningId },
    });
    if (!screening) {
      this.logger.warn('Screening not found', ticketUsageDto.screeningId);
      throw new NotFoundException('Screening not found');
    }

    if (screening.date < new Date()) {
      this.logger.warn('Screening has already started', ticketUsageDto.screeningId);
      throw new BadRequestException('Screening has already started');
    }

    const movieTheater = await this.prisma.movieTheater.findUnique({
      where: { id: screening.movieTheaterId },
    });
    if (!movieTheater) {
      this.logger.warn('Movie theater not found', screening.movieTheaterId);
      throw new NotFoundException('Movie theater not found');
    }

    if (movieTheater.isUnderMaintenance) {
      this.logger.warn('Movie theater is under maintenance', movieTheater.id);
      throw new BadRequestException('Movie theater is under maintenance');
    }    

    if (movieTheater.capacity <= screening.nb_ticket) {
      this.logger.warn('Movie theater is full', movieTheater.id);
      throw new BadRequestException('Movie theater is full');
    }

    if(ticket.type === 'STANDARD'){
      const ticketUsage = await this.prisma.ticketUsage.findFirst({
        where: {
          ticketId: ticketUsageDto.ticketId,
        },
      });
      if (ticketUsage) {
        this.logger.warn('A standard ticket can only be used once', ticketUsageDto.ticketId);
        throw new BadRequestException('A standard ticket can only be used once');
      }
    }
    else{
      const ticketUsages = await this.prisma.ticketUsage.findMany({
        where: {
          ticketId: ticketUsageDto.ticketId,
        },
      });
      if (ticketUsages && ticketUsages.length >= 10) {
        this.logger.warn('A super ticket can only be used 10 times', ticketUsageDto.ticketId);
        throw new BadRequestException('A super ticket can only be used 10 times');
      }
      const alreadyUsed = ticketUsages.find(u => u.screeningId === ticketUsageDto.screeningId);
      if (alreadyUsed) {
        this.logger.warn('Ticket usage already exists', ticketUsageDto.ticketId);
        throw new BadRequestException('Ticket usage already exists');
      }
    }
    return await this.prisma.$transaction(async (tx) => {
      await tx.screening.update({
        where: { id: ticketUsageDto.screeningId },
        data: {
          nb_ticket: { increment: 1 },
        },
      });
    
      return tx.ticketUsage.create({
        data: {
          ticketId: ticketUsageDto.ticketId,
          screeningId: ticketUsageDto.screeningId,
        },
      });
    });
  }
}
