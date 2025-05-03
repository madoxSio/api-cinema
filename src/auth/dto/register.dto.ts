import { ApiProperty, ApiResponse, ApiResponseProperty } from '@nestjs/swagger';
import { IsEmail, IsStrongPassword } from 'class-validator';

export class RegisterDto {
  @IsEmail()
  @ApiProperty({
    description: "User's email address",
    example: 'email@example.com',
  })
  email: string;

  @IsStrongPassword({
    minLength: 8,
    minLowercase: 1,
    minUppercase: 1,
    minNumbers: 1,
    minSymbols: 1,
  })
  @ApiProperty({
    description: "User's password",
    example: 'hn&N6U5rhg0v%T',
  })
  password: string;
}
