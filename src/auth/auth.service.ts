import {
  ConflictException,
  Injectable,
  Logger,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { UsersService } from '../users/users.service';
import * as bcrypt from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';
import { v4 as uuidv4 } from 'uuid';
import { PrismaService } from '../prisma.service';
import { User } from '../users/entities/user.entity';
import { add } from 'date-fns';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    private usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly prisma: PrismaService,
  ) {}

  async validateUser(email: string, password: string) {
    const user = await this.usersService.findByEmail(email);
    if (user && (await bcrypt.compare(password, user.password))) {
      return user;
    }
    throw new UnauthorizedException('Invalid credentials');
  }

  async login(user: User) {
    this.logger.log('Logging in user', user.email);

    const payload = { sub: user.id, role: user.role };
    const accessToken = await this.jwtService.signAsync(payload, {
      secret: process.env.JWT_ACCESS_SECRET,
      expiresIn: process.env.ACCESS_TOKEN_EXPIRATION,
    });

    const refreshToken = uuidv4();
    const expiresAt = add(new Date(), {
      days: Number(process.env.REFRESH_TOKEN_EXPIRATION),
    });

    await this.prisma.refreshToken.create({
      data: {
        token: refreshToken,
        userId: String(user.id),
        expiresAt,
      },
    });

    return {
      accessToken,
      refreshToken,
    };
  }

  async refresh(token: string) {
    this.logger.log('Refreshing token', token);

    const stored = await this.prisma.refreshToken.findUnique({
      where: { token },
    });
    if (!stored || stored.expiresAt < new Date()) {
      throw new UnauthorizedException();
    }

    const user = await this.usersService.findOne(stored.userId);

    if (!user) {
      throw new NotFoundException('Utilisateur non trouvé');
    }

    return this.login(user);
  }

  async logout(userId: string) {
    this.logger.log('Logout user', userId);
    await this.prisma.refreshToken.deleteMany({ where: { userId } });

    return { message: 'Logged out successfully' };
  }

  async register(createUserDto: { email: string; password: string }) {
    this.logger.log('Registering user', createUserDto.email);

    try {
      const hashedPassword = await bcrypt.hash(createUserDto.password, 10);

      return await this.usersService.create({
        ...createUserDto,
        password: hashedPassword,
      });
    } catch (error) {
      this.logger.error('Error in register', error);
      if (
        error instanceof PrismaClientKnownRequestError &&
        error.code === 'P2002'
      ) {
        this.logger.warn('Email already exists');
        throw new ConflictException('Email already exists');
      }

      throw error;
    }
  }
}
