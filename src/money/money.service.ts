import { Injectable, Logger, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';

@Injectable()
export class MoneyService {
    private readonly logger = new Logger(MoneyService.name);
    constructor(private prisma: PrismaService) {}

    async getBalance(id: string) {
        this.logger.log('Finding balance for user', id);
        const user = await this.prisma.user.findUnique({
            where: { id },
        });
        if (!user) {
            this.logger.warn('User not found', id);
            throw new NotFoundException('User not found');
        }
        return user.balance;
    }
    
    async deposit(userId: string, amount: number) {
        await this.prisma.$transaction([
            this.prisma.transaction.create({
            data: {
                userId,
                amount,
                type: 'DEPOSIT',
            },
            }),
            this.prisma.user.update({
            where: { id: userId },
            data: {
                balance: { increment: amount },
            },
            }),
        ]);
    }
    async withdraw(userId: string, amount: number) {
        const user = await this.prisma.user.findUnique({ where: { id: userId } });
        if (!user || user.balance < amount) {
            throw new BadRequestException('Insufficient funds');
        }
        await this.prisma.$transaction([
            this.prisma.transaction.create({
            data: {
                userId,
                amount,
                type: 'WITHDRAWAL',
            },
            }),
            this.prisma.user.update({
            where: { id: userId },
            data: {
                balance: { decrement: amount },
            },
            }),
        ]);
    }
}
