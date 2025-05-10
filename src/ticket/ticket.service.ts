import { Injectable, Logger } from '@nestjs/common';
import { CreateTicketDto } from './dto/create-ticket.dto';
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
    //return 'This action adds a new ticket ' + JSON.stringify(createTicketDto);
  }

  async findAll() {
    return `This action returns all ticket`;
  }

  findOne(id: number) {
    return `This action returns a #${id} ticket`;
  }

  update(id: number, updateTicketDto: UpdateTicketDto) {
    return `This action updates a #${id} ticket`;
  }

  remove(id: number) {
    return `This action removes a #${id} ticket`;
  }
}
