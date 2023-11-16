import { IsArray, IsBoolean, IsNotEmpty, IsString, Min } from 'class-validator';
import { createDTO } from './create.dto';

export class updateDTO extends createDTO {
    @IsNotEmpty()
    id: string;

    @IsNotEmpty()
    thumbnail_url: string;

    @IsNotEmpty()
    @IsNotEmpty()
    is_change_thumbnail: string;

    @IsArray()
    @Min(0)
    image_delete: string[];
}
