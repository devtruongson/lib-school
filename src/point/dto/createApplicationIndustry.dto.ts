import { IsNotEmpty } from 'class-validator';

export class createApplicationIndustry {
    @IsNotEmpty()
    title: string;

    @IsNotEmpty()
    code: string;

    @IsNotEmpty()
    location: string;
}
