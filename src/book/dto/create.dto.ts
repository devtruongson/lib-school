import { ArrayMinSize, IsArray, IsNotEmpty, IsNumber, Min, ValidateNested } from 'class-validator';

export class createDTO {
    // @IsNotEmpty()
    // title: string;

    // @IsNotEmpty()
    // description: string;

    // @IsNumber()
    // @IsNotEmpty()
    // @Min(1)
    // stock: number;

    images: any[];
}
