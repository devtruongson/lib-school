import { IsBoolean, IsNotEmpty, IsNumber } from 'class-validator';

export class updateStatusDTO {
    @IsNotEmpty()
    @IsNumber()
    id: number;

    @IsBoolean()
    @IsNotEmpty()
    is_active: boolean;
}
