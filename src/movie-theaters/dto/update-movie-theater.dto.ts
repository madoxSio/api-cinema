import { PartialType } from '@nestjs/mapped-types';
import { CreateMovieTheaterDto } from './create-movie-theater.dto';

export class UpdateMovieTheaterDto extends PartialType(CreateMovieTheaterDto) {}
