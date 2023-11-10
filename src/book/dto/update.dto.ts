import { IsArray, IsBoolean, IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { createDTO } from './create.dto';

export class updateDTO extends createDTO {
    @IsNumber()
    @IsNotEmpty()
    id: number;

    @IsNotEmpty()
    thumbnail_url: string;

    @IsBoolean()
    is_change_thumbnail: boolean;

    @IsArray()
    @IsString({ each: true })
    image_delete: string[];
}
