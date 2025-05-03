import { Role } from '@prisma/client';

export class User {
  id: string;
  email: string;
  password: string;
  createdAt: Date;
  updatedAt: Date;
  role: Role;
}
