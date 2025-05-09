import { ApiProperty } from '@nestjs/swagger';
import { IsDateString, IsInt, IsNotEmpty } from 'class-validator';

export class CreateScreeningDTO {
  @ApiProperty({ example: '2025-05-06T10:00:00.000Z' })
  @IsDateString()
  start: string;

  @ApiProperty({ example: '2025-05-06T12:30:00.000Z' })
  @IsDateString()
  end: string;

  @ApiProperty({ example: 1 })
  @IsInt()
  movieId: number;

  @ApiProperty({ example: 1 })
  @IsInt()
  movieTheaterId: number;

  @ApiProperty({ example: '2025-05-06T00:00:00.000Z' })
  @IsDateString()
  date: string;

  @ApiProperty({ example: 25 })
  @IsInt()
  nb_ticket: number;
}
