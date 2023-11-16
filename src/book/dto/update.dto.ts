import { IsNotEmpty } from 'class-validator';
import { createDTO } from './create.dto';

export class updateDTO extends createDTO {
    @IsNotEmpty()
    id: string;

    @IsNotEmpty()
    thumbnail_url: string;

    @IsNotEmpty()
    @IsNotEmpty()
    is_change_thumbnail: string;

    image_delete: string[];
}
