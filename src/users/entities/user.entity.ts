import { ApiProperty } from '@nestjs/swagger';
import { Role } from '@prisma/client';


export class User {
  @ApiProperty({
    description: 'Unique identifier for the user',
    example: '12345',
  })
  id: string;

  @ApiProperty({
    description: 'Email address of the user',
    example: 'test@test.com',
  })
  email: string;

  @ApiProperty({
    description: 'Hashed password of the user',
    example: '2b$10$xS0igdeBBTUNk3X5w8wOFuC5/QDY1uso1yGwHQ.8yPj0yKbTjDXt6',
  })
  password: string;

  @ApiProperty({
    description: 'Date when the user was created',
    example: '2023-10-01T12:00:00Z',
  })
  createdAt: Date;

  @ApiProperty({
    description: 'Date when the user was last updated',
    example: '2023-10-01T12:00:00Z',
  })
  updatedAt: Date;

  @ApiProperty({
    description: 'Role of the user',
    example: 'CLIENT',
  })
  role: Role;
}
