import { ApiProperty } from '@nestjs/swagger';
import { CreateMovieTheaterResponseDto } from './create-movie-theater.dto';
import { CreateScreeningDTO } from 'src/screening/dto/create-screening.dto';
import { CreateMovieDto } from 'src/movies/dto/create-movie.dto';

export class ScreeningResponseDto extends CreateScreeningDTO {
  movie: CreateMovieDto;
}

export class GetTheaterScheduleResponseDto {
  @ApiProperty({
    description: 'Theater information',
    type: CreateMovieTheaterResponseDto,
  })
  theater: CreateMovieTheaterResponseDto;

  @ApiProperty({
    description: 'List of screenings',
    type: [ScreeningResponseDto],
  })
  screenings: ScreeningResponseDto[];
}
