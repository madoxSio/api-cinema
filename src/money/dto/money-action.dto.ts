import { IsNumber, Min } from 'class-validator';
export class MoneyActionDto {
    @IsNumber()
    @Min(0.01)
    amount: number;
}