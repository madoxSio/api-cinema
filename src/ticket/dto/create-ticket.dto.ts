import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, isNumber, IsNumber, IsString } from 'class-validator';

export enum TypeTicket {
    STANDARD = 'STANDARD',
    SUPER = 'SUPER',
}

export class CreateTicketDto {
    @IsEnum(TypeTicket, { message: 'type must be STANDARD or SUPER' })
    @ApiProperty({ enum: TypeTicket, description: 'Ticket type' })
    type: TypeTicket;
  }

export class CreateTicketUsageDto{
    @IsNumber({}, { message: 'movieTheaterId must be a number' })
    screeningId: number;
    @IsNumber({}, { message: 'ticketId must be a number' })
    ticketId: number
}