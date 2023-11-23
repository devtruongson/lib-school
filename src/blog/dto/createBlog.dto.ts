import { IsBoolean, IsNotEmpty } from 'class-validator';

export class createBlogDTO {
    @IsNotEmpty()
    title: string;

    @IsBoolean()
    is_active: boolean;

    @IsNotEmpty()
    meta_description: string;

    @IsNotEmpty()
    contentHTML: string;

    @IsNotEmpty()
    contentMarkDown: string;
}
