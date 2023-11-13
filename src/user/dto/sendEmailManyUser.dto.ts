import { IsEmail, IsNotEmpty } from 'class-validator';

export class sendEmailManyUserDTO {
    @IsNotEmpty()
    @IsEmail()
    email: string[];

    @IsNotEmpty()
    html: string;
}
