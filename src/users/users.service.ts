import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaService } from '../prisma.service';
import * as bcrypt from 'bcryptjs';

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

  async findAll() {
    this.logger.log('Finding all users');
    return await this.prisma.user.findMany();
  }

  async findOne(id: string) {
    this.logger.log('Finding user by id', id);
    const user = await this.prisma.user.findUnique({
      where: { id },
    });

    if (!user) {
      this.logger.warn('User not found', id);
      throw new NotFoundException('User not found');
    }
    return user;
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    this.logger.log('Updating user', { id, updateUserDto });
    const user = await this.prisma.user.findUnique({
      where: { id },
    });

    if (!user) {
      this.logger.warn('User not found', id);
      throw new NotFoundException('User not found');
    }

    if (updateUserDto.email) {
      const existingUser = await this.prisma.user.findUnique({
        where: { email: updateUserDto.email },
      });
      if (existingUser && existingUser.id !== id) {
        this.logger.warn('Email already in use', updateUserDto.email);
        throw new NotFoundException('Email already in use');
      }
    }

    if (updateUserDto.password) {
      updateUserDto.password = await bcrypt.hash(updateUserDto.password, 10);
    }

    return await this.prisma.user.update({
      where: { id },
      data: updateUserDto,
    });
  }

  async remove(id: string) {
    this.logger.log('Removing user', id);

    const user = await this.prisma.user.findUnique({
      where: { id },
    });

    if (!user) {
      this.logger.warn('User not found', id);
      throw new NotFoundException('User not found');
    }

    return await this.prisma.user.delete({
      where: { id },
    });
  }

  async findByEmail(email: string) {
    this.logger.log('Finding user by email', email);
    return await this.prisma.user.findUnique({
      where: { email },
    });
  }
  async findAllTicketUsages(id: string){
    this.logger.log('Finding all ticket usages for user', id);
    const user = await this.prisma.user.findUnique({
      where: { id },
    });
    if (!user) {
      this.logger.warn('User not found', id);
      throw new NotFoundException('User not found');
    }
    const tickets = await this.prisma.ticket.findMany({
      where: { 
        userId: id,
        usages: {
          some: {}
        },
      },
      include: {
        usages: {
          include: {
            screening: {
              include: {
                movie: true,
                movieTheater: true,
              },
            },
          },
        },
      },
    });
    return tickets;
  }
}
