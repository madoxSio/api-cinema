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

export class LoginResponseDto {
  @ApiProperty({
    description: 'Access token',
    example:
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIwMmYwOTQxNi05ZTY0LTQ1YjctOGJiYS02NjU4MzRjYjVhZjMiLCJyb2xlIjoiQURNSU4iLCJpYXQiOjE3NDYzMDgyNTcsImV4cCI6MTc0NjMwODU1N30.IfF1kl5gVLfq3rKN5LhYc6aqV50ztd_9e445n-FxuJo',
  })
  accessToken: string;

  @ApiProperty({
    description: 'Refresh token',
    example: 'ab104119-2f47-4d0c-b3c8-acff8a9f8f00',
  })
  refreshToken: string;
}
