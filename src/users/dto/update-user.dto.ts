import { ApiProperty, PartialType } from '@nestjs/swagger';
import { CreateUserDto } from './create-user.dto';
import { Role } from '@prisma/client';
import { IsEnum, IsOptional } from 'class-validator';

export class UpdateUserDto extends PartialType(CreateUserDto) {
  @ApiProperty({
    description: 'Role of the user',
    example: 'CLIENT',
  })
  @IsEnum(Role)
  @IsOptional()
  role?: Role;
}
