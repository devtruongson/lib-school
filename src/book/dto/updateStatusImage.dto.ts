import { IsBoolean, IsNotEmpty, IsNumber } from 'class-validator';

export class updateStatusImage {
    @IsNotEmpty()
    @IsNumber()
    id: number;

    @IsBoolean()
    @IsNotEmpty()
    is_active: boolean;
}
