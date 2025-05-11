import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpCode,
  ParseIntPipe,
  UseGuards,
  Query,
} from '@nestjs/common';
import { MoviesService } from './movies.service';
import { CreateMovieDto } from './dto/create-movie.dto';
import { UpdateMovieDto } from './dto/update-movie.dto';
import {
  ApiTags,
  ApiOperation,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiNotFoundResponse,
  ApiBadRequestResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt.guard';
import { Role } from '@prisma/client';
import { Roles } from '../auth/decorators/roles.decorator';

@ApiTags('Movies')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('movies')
export class MoviesController {
  constructor(private readonly moviesService: MoviesService) {}

  @Roles(Role.ADMIN)
  @Post()
  @HttpCode(201)
  @ApiOperation({
    summary: 'Create a new movie',
    description: 'This endpoint allows you to create a new movie.',
  })
  @ApiCreatedResponse({
    description: 'Movie created successfully.',
    type: CreateMovieDto,
  })
  @ApiBadRequestResponse({ description: 'Invalid input.' })
  create(@Body() createMovieDto: CreateMovieDto) {
    return this.moviesService.create(createMovieDto);
  }

  @Get()
  @ApiOperation({
    summary: 'Get all movies',
    description: 'Returns a list of all movies in the database.',
  })
  @ApiOkResponse({
    description: 'List of movies retrieved successfully.',
    type: [CreateMovieDto], // ou un DTO de réponse spécifique si tu en as un
  })
  findAll() {
    return this.moviesService.findAll();
  }

  @Get('spec')
  async getMovieSchedule(
    @Query('start') start: string,
    @Query('end') end: string,
    @Query('movieTitle') movieTitle: string,
  ) {
    return this.moviesService.getMovieOnPeriod(start, end, movieTitle);
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Get a movie by ID',
    description: 'Returns the details of a specific movie.',
  })
  @ApiOkResponse({
    description: 'Movie retrieved successfully.',
    type: CreateMovieDto,
  })
  @ApiNotFoundResponse({ description: 'Movie not found.' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.moviesService.findOne(id);
  }

  @Roles(Role.ADMIN)
  @Patch(':id')
  @ApiOperation({
    summary: 'Update a movie',
    description: 'Updates the details of a movie by its ID.',
  })
  @ApiOkResponse({
    description: 'Movie updated successfully.',
    type: UpdateMovieDto,
  })
  @ApiBadRequestResponse({ description: 'Invalid input.' })
  @ApiNotFoundResponse({ description: 'Movie not found.' })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateMovieDto: UpdateMovieDto,
  ) {
    return this.moviesService.update(id, updateMovieDto);
  }

  @Roles(Role.ADMIN)
  @Delete(':id')
  @HttpCode(200)
  @ApiOperation({
    summary: 'Delete a movie',
    description: 'Deletes a movie by its ID.',
  })
  @ApiOkResponse({ description: 'Movie deleted successfully.' })
  @ApiNotFoundResponse({ description: 'Movie not found.' })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.moviesService.remove(id);
  }
}
