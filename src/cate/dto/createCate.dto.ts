import { IsBoolean, IsNotEmpty } from 'class-validator';

export class createCateDTO {
    @IsNotEmpty()
    title: string;

    @IsNotEmpty()
    description: string;

    @IsNotEmpty()
    description_markdown: string;

    @IsBoolean()
    @IsNotEmpty()
    is_active: boolean;
}
