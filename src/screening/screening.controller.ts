import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ScreeningService } from './screening.service';
import { CreateScreeningDTO } from './dto/create-screening.dto';
import { UpdateScreeningDto } from './dto/update-screening.dto';

@UseGuards(JwtAuthGuard)
@Controller('screening')
export class ScreeningController {
  constructor(private readonly screeningService: ScreeningService) {}

  @Post()
  create(@Body() createScreeningDto: CreateScreeningDTO) {
    return this.screeningService.create(createScreeningDto);
  }

  @Get()
  findAll() {
    return this.screeningService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.screeningService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateScreeningDto: UpdateScreeningDto) {
    return this.screeningService.update(+id, updateScreeningDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.screeningService.remove(+id);
  }
}
