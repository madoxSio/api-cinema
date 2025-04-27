import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ValidationPipe,
} from '@nestjs/common';
import { MovieTheaterService } from './movie-theater.service';
import { CreateMovieTheaterDto } from './dto/create-movie-theater.dto';
import { UpdateMovieTheaterDto } from './dto/update-movie-theater.dto';

@Controller('movie-theater')
export class MovieTheaterController {
  constructor(private readonly movieTheaterService: MovieTheaterService) {}

  @Post()
  create(@Body(ValidationPipe) createMovieTheaterDto: CreateMovieTheaterDto) {
    return this.movieTheaterService.create(createMovieTheaterDto);
  }

  @Get()
  findAll() {
    return this.movieTheaterService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.movieTheaterService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body(ValidationPipe) updateMovieTheaterDto: UpdateMovieTheaterDto,
  ) {
    return this.movieTheaterService.update(+id, updateMovieTheaterDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.movieTheaterService.remove(+id);
  }
}
