import { ArrayMinSize, IsArray, IsBoolean, IsNotEmpty, IsNumber, Min } from 'class-validator';

export class createDTO {
    @IsNotEmpty()
    title: string;

    @IsNotEmpty()
    description: string;

    @IsNotEmpty()
    description_markdown: string;

    @IsNumber()
    @IsNotEmpty()
    @Min(1)
    stock: number;

    @IsBoolean()
    is_active: boolean;

    @IsNotEmpty()
    @IsArray()
    @ArrayMinSize(1)
    categories: number[];

    images: any[];
}
