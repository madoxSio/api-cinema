import { IsEnum, IsString } from 'class-validator';

export enum TypeTicket {
    STANDARD = 'STANDARD',
    SUPER = 'SUPER',
}

export class CreateTicketDto {
    @IsString({ message: 'userId must be a string' })
    userId: string;
    @IsEnum(TypeTicket, { message: 'type must be STANDARD or SUPER' })
    type: TypeTicket;
}