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
  Query,
} from '@nestjs/common';
import { MovieTheatersService } from './movie-theaters.service';
import {
  CreateMovieTheaterDto,
  CreateMovieTheaterResponseDto,
} from './dto/create-movie-theater.dto';
import { UpdateMovieTheaterDto } from './dto/update-movie-theater.dto';
import { JwtAuthGuard } from '../auth/guards/jwt.guard';
import {
  ApiBody,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
  ApiProperty,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { GetTheaterScheduleDto } from './dto/get-theater-schedule.dto';

@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('movie-theaters')
export class MovieTheatersController {
  constructor(private readonly movieTheatersService: MovieTheatersService) {}

  @Post()
  @ApiProperty({
    description: 'Create a new movie theater hall',
    type: CreateMovieTheaterDto,
  })
  @ApiCreatedResponse({
    description: 'Movie theater hall created successfully',
    type: CreateMovieTheaterResponseDto,
  })
  @ApiOperation({
    summary: 'Create a new movie theater hall',
    description: 'This endpoint creates a new movie theater hall.',
  })
  create(@Body(ValidationPipe) createMovieTheaterDto: CreateMovieTheaterDto) {
    return this.movieTheatersService.create(createMovieTheaterDto);
  }

  @Get()
  @ApiOkResponse({
    description: 'Get all movie theater halls',
    type: [CreateMovieTheaterResponseDto],
  })
  @ApiOperation({
    summary: 'Get all movie theater halls',
    description: 'This endpoint retrieves all movie theater halls.',
  })
  findAll() {
    return this.movieTheatersService.findAll();
  }

  @Get(':id')
  @ApiOkResponse({
    description: 'Get a movie theater hall by ID',
    type: CreateMovieTheaterResponseDto,
  })
  @ApiOperation({
    summary: 'Get a movie theater hall by ID',
    description: 'This endpoint retrieves a movie theater hall by its ID.',
  })
  findOne(@Param('id') id: string) {
    return this.movieTheatersService.findOne(+id);
  }

  @Patch(':id')
  @ApiBody({
    description: 'Update a movie theater hall',
    schema: {
      example: {
        name: 'Updated Theater',
      },
    },
  })
  @ApiOkResponse({
    description: 'Movie theater hall updated successfully',
    example: {
      id: 1,
      name: 'Updated Theater',
      description: 'A test movie theater',
      type: 'IMAX',
      capacity: 27,
      hasDisabledAccess: true,
      photos: ['photo1.jpg', 'photo2.jpg'],
    },
  })
  @ApiOperation({
    summary: 'Update a movie theater hall',
    description: 'This endpoint updates a movie theater hall by its ID.',
  })
  update(
    @Param('id') id: string,
    @Body(ValidationPipe) updateMovieTheaterDto: UpdateMovieTheaterDto,
  ) {
    return this.movieTheatersService.update(+id, updateMovieTheaterDto);
  }

  @Delete(':id')
  @ApiOkResponse({
    description: 'Movie theater hall deleted successfully',
    type: CreateMovieTheaterResponseDto,
  })
  @ApiOperation({
    summary: 'Delete a movie theater hall',
    description: 'This endpoint deletes a movie theater hall by its ID.',
  })
  remove(@Param('id') id: string) {
    return this.movieTheatersService.remove(+id);
  }

  @Get(':id/schedule')
  @ApiOperation({
    summary: 'Get movie theater schedule',
    description: 'Get the schedule of a movie theater for a specific period',
  })
  @ApiOkResponse({
    description: 'Movie theater schedule retrieved successfully',
    schema: {
      type: 'object',
      properties: {
        theater: {
          type: 'object',
          properties: {
            id: { type: 'number' },
            name: { type: 'string' },
            description: { type: 'string' },
            type: { type: 'string' },
            capacity: { type: 'number' },
            hasDisabledAccess: { type: 'boolean' },
            isUnderMaintenance: { type: 'boolean' },
          },
        },
        screenings: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              id: { type: 'number' },
              start: { type: 'string' },
              end: { type: 'string' },
              date: { type: 'string' },
              movie: {
                type: 'object',
                properties: {
                  id: { type: 'number' },
                  title: { type: 'string' },
                  description: { type: 'string' },
                  duration: { type: 'number' },
                },
              },
            },
          },
        },
      },
    },
  })
  getTheaterSchedule(
    @Param('id') id: string,
    @Query(ValidationPipe) scheduleDto: GetTheaterScheduleDto,
  ) {
    return this.movieTheatersService.getTheaterSchedule(+id, scheduleDto);
  }
}
