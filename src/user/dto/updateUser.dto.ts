import { Type } from 'class-transformer';
import { IsEmail, IsNotEmpty, ValidateNested } from 'class-validator';

class userUpdate {
    @IsNotEmpty()
    firstName: string;

    @IsNotEmpty()
    lastName: string;
}

class profileUpdate {
    @IsNotEmpty()
    avatar_url: string;

    @IsNotEmpty()
    phoneNumber: string;

    @IsNotEmpty()
    address: string;

    @IsNotEmpty()
    school: string;

    @IsNotEmpty()
    class: string;

    @IsNotEmpty()
    birthday: string;

    @IsNotEmpty()
    description: string;
}

export class updateUserDTO {
    @ValidateNested()
    @Type(() => userUpdate)
    user: userUpdate;

    @ValidateNested()
    @Type(() => profileUpdate)
    profile: profileUpdate;
}
