import { IsEmail, IsNotEmpty } from 'class-validator';

export class signInFireBaseDTO {
    @IsEmail()
    @IsNotEmpty()
    email: string;

    @IsNotEmpty()
    lastName: string;

    @IsNotEmpty()
    avatar_url: string;
}
