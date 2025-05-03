import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ValidationPipe,
  UseGuards,
} from '@nestjs/common';
import { MovieTheatersService } from './movie-theaters.service';
import { CreateMovieTheaterDto } from './dto/create-movie-theater.dto';
import { UpdateMovieTheaterDto } from './dto/update-movie-theater.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt.guard';

@UseGuards(JwtAuthGuard)
@Controller('movie-theaters')
export class MovieTheatersController {
  constructor(private readonly movieTheatersService: MovieTheatersService) {}

  @Post()
  create(@Body(ValidationPipe) createMovieTheaterDto: CreateMovieTheaterDto) {
    return this.movieTheatersService.create(createMovieTheaterDto);
  }

  @Get()
  findAll() {
    return this.movieTheatersService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.movieTheatersService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body(ValidationPipe) updateMovieTheaterDto: UpdateMovieTheaterDto,
  ) {
    return this.movieTheatersService.update(+id, updateMovieTheaterDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.movieTheatersService.remove(+id);
  }
}
