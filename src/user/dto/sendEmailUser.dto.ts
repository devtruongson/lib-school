import { IsEmail, IsNotEmpty } from 'class-validator';

export class sendEmailUserDTO {
    @IsNotEmpty()
    @IsEmail()
    email: string;

    @IsNotEmpty()
    html: string;
}
