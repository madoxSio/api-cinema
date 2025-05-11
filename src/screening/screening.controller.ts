import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  HttpCode,
  ParseIntPipe,
  Query,
} from '@nestjs/common';
import { ScreeningService } from './screening.service';
import { CreateScreeningDTO } from './dto/create-screening.dto';
import { UpdateScreeningDto } from './dto/update-screening.dto';
import { JwtAuthGuard } from '../auth/guards/jwt.guard';
import {
  ApiTags,
  ApiBearerAuth,
  ApiOperation,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiNotFoundResponse,
  ApiBadRequestResponse,
} from '@nestjs/swagger';
import { Role } from '@prisma/client';
import { Roles } from 'src/auth/decorators/roles.decorator';

@ApiTags('Screenings')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('screening')
export class ScreeningController {
  constructor(private readonly screeningService: ScreeningService) {}

  @Roles(Role.ADMIN)
  @Post()
  @HttpCode(201)
  @ApiOperation({
    summary: 'Create a new screening',
    description:
      'Creates a new screening (movie showing) with date, time, and theater.',
  })
  @ApiCreatedResponse({
    description: 'Screening created successfully.',
    type: CreateScreeningDTO,
  })
  @ApiBadRequestResponse({ description: 'Invalid screening data.' })
  create(@Body() createScreeningDto: CreateScreeningDTO) {
    return this.screeningService.create(createScreeningDto);
  }

  @Roles(Role.ADMIN)
  @Post('many')
  @ApiOperation({ summary: 'Insère plusieurs séances' })
  @ApiCreatedResponse({ description: 'Séances insérées' })
  createMany(@Body() data: CreateScreeningDTO[]) {
    return this.screeningService.createMany(data);
  }

  @Get()
  @ApiOperation({
    summary: 'Get all screenings',
    description: 'Returns a list of all screenings.',
  })
  @ApiOkResponse({
    description: 'List of screenings retrieved successfully.',
    type: [CreateScreeningDTO],
  })
  findAll() {
    return this.screeningService.findAll();
  }

  @Get('planning')
  @ApiOperation({
    summary: 'Get screenings in a date range',
    description: 'Returns all screenings between a start and end date.',
  })
  @ApiOkResponse({
    description: 'Screenings retrieved successfully within the date range.',
    type: [CreateScreeningDTO],
  })
  @ApiBadRequestResponse({ description: 'Invalid or missing date parameters.' })
  async getPlanning(@Query('start') start: string, @Query('end') end: string) {
    return this.screeningService.getPlanning(start, end);
  }

  @Get(':id/tickets')
  @ApiOperation({ summary: 'Get number of tickets sold for a screening' })
  @ApiOkResponse({ description: 'Returns number of tickets sold' })
  getNbTickets(@Param('id', ParseIntPipe) id: number) {
    return this.screeningService.getTickets(id);
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Get screening by ID',
    description: 'Returns details of a screening by its ID.',
  })
  @ApiOkResponse({
    description: 'Screening retrieved successfully.',
    type: CreateScreeningDTO,
  })
  @ApiNotFoundResponse({ description: 'Screening not found.' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.screeningService.findOne(id);
  }

  @Roles(Role.ADMIN)
  @Patch(':id')
  @ApiOperation({
    summary: 'Update a screening',
    description: 'Updates a screening by its ID.',
  })
  @ApiOkResponse({
    description: 'Screening updated successfully.',
    type: UpdateScreeningDto,
  })
  @ApiBadRequestResponse({ description: 'Invalid update data.' })
  @ApiNotFoundResponse({ description: 'Screening not found.' })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateScreeningDto: UpdateScreeningDto,
  ) {
    return this.screeningService.update(id, updateScreeningDto);
  }

  @Roles(Role.ADMIN)
  @Delete(':id')
  @HttpCode(200)
  @ApiOperation({
    summary: 'Delete a screening',
    description: 'Deletes a screening by its ID.',
  })
  @ApiOkResponse({ description: 'Screening deleted successfully.' })
  @ApiNotFoundResponse({ description: 'Screening not found.' })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.screeningService.remove(id);
  }
}
