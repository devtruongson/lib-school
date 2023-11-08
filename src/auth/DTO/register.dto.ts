import { IsEmail, IsNotEmpty, Length } from 'class-validator';

export class registerDTO {
    @IsNotEmpty()
    @IsEmail()
    email: string;

    @IsNotEmpty()
    @Length(8, 15, {
        message:
            'Your password must be between 8 and 15 characters long | Mật khẩu của bạn phải có độ dài trong khoảng từ 8 đến 15 ký tự!',
    })
    password: string;

    @IsNotEmpty()
    firstName: string;

    @IsNotEmpty()
    lastName: string;
}
