import { Injectable, Logger } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaService } from '../prisma.service';

@Injectable()
export class UsersService {
  private readonly logger = new Logger(UsersService.name);

  constructor(private prisma: PrismaService) {}

  async create(createUserDto: CreateUserDto) {
    this.logger.log('Creating user', createUserDto);

    return await this.prisma.user.create({
      data: {
        email: createUserDto.email,
        password: createUserDto.password,
      },
    });
  }

  findAll() {
    this.logger.log('Finding all users');
    return this.prisma.user.findMany();
  }

  async findOne(id: string) {
    this.logger.log('Finding user by id', id);
    return await this.prisma.user.findUnique({
      where: { id },
    });
  }

  update(id: string, updateUserDto: UpdateUserDto) {
    this.logger.log('Updating user', { id, updateUserDto });
    return this.prisma.user.update({
      where: { id },
      data: updateUserDto,
    });
  }

  remove(id: string) {
    this.logger.log('Removing user', id);
    return this.prisma.user.delete({
      where: { id },
    });
  }

  async findByEmail(email: string) {
    this.logger.log('Finding user by email', email);
    return await this.prisma.user.findUnique({
      where: { email },
    });
  }
}
