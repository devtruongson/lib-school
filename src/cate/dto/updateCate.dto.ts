import { IsNotEmpty } from 'class-validator';
import { createCateDTO } from './createCate.dto';

export class updateCateDTO extends createCateDTO {
    @IsNotEmpty()
    id: number;
}
