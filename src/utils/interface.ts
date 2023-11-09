export interface IJwtPayload {
    id: number;
    fistName: string;
    lastName: string;
    email: string;
    role: string;
    is_login_fire_base: boolean;
}

export interface IVerifyAccount {
    email: string;
    token_url: string;
}

