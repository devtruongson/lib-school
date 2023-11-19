import { IsNumber } from 'class-validator';

export class createOrderDTO {
    @IsNumber()
    books: number;
}
