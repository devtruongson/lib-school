import { User } from 'src/typeorm/entities/User';
import { Repository } from 'typeorm';
import { registerDTO } from './DTO/register.dto';
import { Request, Response } from 'express';
import { JwtService } from '@nestjs/jwt';
import { IJwtPayload } from 'src/utils/interface';
export declare class AuthService {
    private readonly userRepository;
    private readonly jwtService;
    constructor(userRepository: Repository<User>, jwtService: JwtService);
    registerUser(userDTO: registerDTO, req: Request, res: Response): Promise<User | void>;
    checkUserExits(email: string): Promise<User | null>;
    generateHashPassword(password: string): Promise<string>;
    generateToken(payload: IJwtPayload): Promise<{
        access_token: string;
        refresh_token: string;
    }>;
    handleSenToken(token: {
        access_token: string;
        refresh_token: string;
    }, Req: Request, Res: Response): void;
}
