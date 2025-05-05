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

@ApiTags('Screenings')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('screening')
export class ScreeningController {
  constructor(private readonly screeningService: ScreeningService) {}

  @Post()
  @HttpCode(201)
  @ApiOperation({
    summary: 'Create a new screening',
    description: 'Creates a new screening (movie showing) with date, time, and theater.',
  })
  @ApiCreatedResponse({
    description: 'Screening created successfully.',
    type: CreateScreeningDTO,
  })
  @ApiBadRequestResponse({ description: 'Invalid screening data.' })
  create(@Body() createScreeningDto: CreateScreeningDTO) {
    return this.screeningService.create(createScreeningDto);
  }

  @Get()
  @ApiOperation({
    summary: 'Get all screenings',
    description: 'Returns a list of all screenings.',
  })
  @ApiOkResponse({
    description: 'List of screenings retrieved successfully.',
    type: [CreateScreeningDTO], // ou un DTO de réponse
  })
  findAll() {
    return this.screeningService.findAll();
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
