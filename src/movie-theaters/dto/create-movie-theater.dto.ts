import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsArray,
  IsBoolean,
  IsNumber,
  IsOptional,
  IsString,
  Max,
  Min,
  MinLength,
} from 'class-validator';

export class CreateMovieTheaterDto {
  @ApiProperty({ example: 'Salle Magelan' })
  @IsString()
  @MinLength(3)
  name: string;

  @ApiProperty({ example: 'La salle Magelan composé de fauteuils éléctrique' })
  @IsString()
  @MinLength(10)
  description: string;

  @ApiProperty({
    description: 'Liste des url des photos de la salle',
    example: [
      'https://example.com/photo1.jpg',
      'https://example.com/photo2.jpg',
    ],
    type: [String],
  })
  @IsArray()
  @IsString({ each: true })
  @Type(() => String)
  photos: string[];

  @ApiProperty({ example: 'Grand' })
  @IsString()
  @MinLength(2)
  type: string;

  @ApiProperty({ example: 1900 })
  @IsNumber()
  @Min(15)
  @Max(30)
  capacity: number;

  @ApiProperty({ example: true })
  @IsBoolean()
  @IsOptional()
  hasDisabledAccess?: boolean;

  @ApiProperty({ example: true })
  @IsBoolean()
  @IsOptional()
  isUnderMaintenance?: boolean;
}

export class CreateMovieTheaterResponseDto {
  @ApiProperty({ example: 5 })
  id: number;

  @ApiProperty({ example: 'Salle Magelan' })
  name: string;

  @ApiProperty({ example: 'La salle Magelan composé de fauteuils éléctrique' })
  description: string;

  @ApiProperty({
    description: 'Liste des url des photos de la salle',
    example: [
      'https://example.com/photo1.jpg',
      'https://example.com/photo2.jpg',
    ],
    type: [String],
  })
  photos: string[];

  @ApiProperty({ example: 'Grand' })
  type: string;

  @ApiProperty({ example: 1900 })
  capacity: number;

  @ApiProperty({ example: true })
  hasDisabledAccess?: boolean;

  @ApiProperty({ example: true })
  isUnderMaintenance?: boolean;
}
