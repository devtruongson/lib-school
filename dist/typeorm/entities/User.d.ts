import { ROLE_APP_MANAGE } from 'src/utils/enum';
import { Order } from './Order';
import { Profile } from './Profile';
export declare class User {
    id: number;
    fistName: string;
    lastName: string;
    email: string;
    password: string;
    is_verify_email: boolean;
    role: ROLE_APP_MANAGE.user | ROLE_APP_MANAGE.admin;
    slug: string;
    orders: Order[];
    profile: Profile;
    is_login_fire_base: boolean;
    created_At: Date;
    updated_At: Date;
}
