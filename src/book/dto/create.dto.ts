import { ArrayMinSize, IsArray, IsBoolean, IsNotEmpty, IsNumber, Min } from 'class-validator';

export class createDTO {
    @IsNotEmpty()
    title: string;

    @IsNotEmpty()
    meta_description: string;

    @IsNotEmpty()
    description: string;

    @IsNotEmpty()
    description_markdown: string;

    @IsNotEmpty()
    stock: string;

    @IsNotEmpty()
    is_active: 'true' | 'false';

    @IsNotEmpty()
    @IsArray()
    @ArrayMinSize(1)
    categories: number[];

    images: any[];
}
