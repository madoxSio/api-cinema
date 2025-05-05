import { PartialType } from '@nestjs/swagger';
import { CreateScreeningDTO } from './create-screening.dto';

export class UpdateScreeningDto extends PartialType(CreateScreeningDTO) {}
