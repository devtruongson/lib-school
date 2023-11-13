import { IsEmail, IsNotEmpty } from 'class-validator';

export class sendEmailManyUserDTO {
    @IsNotEmpty()
    email: string[];

    @IsNotEmpty()
    html: string;
}
