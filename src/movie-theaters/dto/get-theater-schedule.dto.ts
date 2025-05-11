import { ApiProperty } from '@nestjs/swagger';
import { IsDateString, IsNotEmpty } from 'class-validator';

export class GetTheaterScheduleDto {
  @ApiProperty({
    description: 'Date de début de la période',
    example: '2024-05-01T00:00:00.000Z',
  })
  @IsDateString()
  @IsNotEmpty()
  startDate: string;

  @ApiProperty({
    description: 'Date de fin de la période',
    example: '2024-05-07T23:59:59.999Z',
  })
  @IsDateString()
  @IsNotEmpty()
  endDate: string;
}
