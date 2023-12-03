import { IsNotEmpty } from 'class-validator';

export class createLocation {
    @IsNotEmpty()
    title: string;

    @IsNotEmpty()
    code: string;
}
