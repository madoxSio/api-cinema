import { ApiProperty } from '@nestjs/swagger';
import {
  IsInt,
  IsNotEmpty,
  IsPositive,
  IsString,
  Max,
  Min,
  MinLength,
} from 'class-validator';

export class CreateMovieDto {
  @ApiProperty({ example: 'Spider-Man 3' })
  @IsNotEmpty()
  @IsString()
  title: string;

  @ApiProperty({
    example: "C'est l'histoire d'un jeune homme qui se rend compte qu'il a des pouvoirs.",
  })
  @IsNotEmpty()
  @IsString()
  @MinLength(10)
  description: string;

  @ApiProperty({ example: 2025, minimum: 1900, maximum: 2100 })
  @IsInt()
  @Min(1900)
  @Max(2100)
  year: number;

  @ApiProperty({ example: 16, minimum: 0, maximum: 99 })
  @IsInt()
  @Min(0)
  @Max(99)
  age_min: number;

  @ApiProperty({ example: 120, minimum: 30, maximum: 300 })
  @IsInt()
  @Min(30)
  @Max(300)
  duration: number;
}
