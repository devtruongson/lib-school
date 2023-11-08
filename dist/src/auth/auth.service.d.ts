import { User } from 'src/typeorm/entities/User';
import { Repository } from 'typeorm';
import { registerDTO } from './DTO/register.dto';
import { Request, Response } from 'express';
import { JwtService } from '@nestjs/jwt';
import { IJwtPayload } from 'src/utils/interface';
import { signInFireBaseDTO } from './DTO/signInFireBase.dto';
import { Profile } from 'src/typeorm/entities/Profile';
export declare class AuthService {
    private readonly userRepository;
    private readonly profileRepository;
    private readonly jwtService;
    constructor(userRepository: Repository<User>, profileRepository: Repository<Profile>, jwtService: JwtService);
    registerUser(userDTO: registerDTO, req: Request, res: Response): Promise<User | void>;
    signInWithFireBase(signInFireBase: signInFireBaseDTO, req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
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
