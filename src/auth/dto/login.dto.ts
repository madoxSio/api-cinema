import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString } from 'class-validator';

export class LoginDto {
  @IsEmail()
  @ApiProperty({
    description: "User's email address",
    example: 'email@example.com',
  })
  email: string;

  @IsString()
  @ApiProperty({
    description: "User's password",
    example: 'hn&N6U5rhg0v%T',
  })
  password: string;
}
