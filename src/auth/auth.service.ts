import { BadGatewayException, HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/typeorm/entities/User';
import { Repository } from 'typeorm';
import { registerDTO } from './DTO/register.dto';
import { UserExitsException } from 'src/helpers/exceptions';
import { Request, Response } from 'express';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { IJwtPayload } from 'src/utils/interface';
import { v4 as uuid4 } from 'uuid';
import slugify from 'slugify';
import { sendResponse } from 'src/helpers/sendResponse';

const saltOrRounds: number = 10;
@Injectable()
export class AuthService {
    constructor(
        @InjectRepository(User) private readonly userRepository: Repository<User>,
        private readonly jwtService: JwtService,
    ) {}

    async registerUser(userDTO: registerDTO, req: Request, res: Response): Promise<User | void> {
        const checkUserExits = await this.checkUserExits(userDTO.email);

        if (checkUserExits) {
            throw new UserExitsException();
        }

        const passwordHash = await this.generateHashPassword(userDTO.password);
        try {
            const newUser: User = this.userRepository.create({
                email: userDTO.email,
                password: passwordHash,
                fistName: userDTO.firstName,
                lastName: userDTO.lastName,
                slug: slugify(`${userDTO.firstName} ${userDTO.lastName} ${uuid4()}`),
            });

            const userSave: User = await this.userRepository.save(newUser);
            delete userSave.password;
            const Token: { access_token: string; refresh_token: string } = await this.generateToken(userSave);
            this.handleSenToken(Token, req, res);
            res.status(HttpStatus.OK).json(
                sendResponse({
                    statusCode: HttpStatus.OK,
                    data: {
                        user: userSave,
                    },
                    message: 'You have successfully registered | Bạn đã đăng ký thành công!',
                }),
            );
        } catch (error) {
            console.log(error);
            throw new HttpException(
                'An error occurred, please try again | Có lỗi xảy ra vui lòng thử lại!',
                HttpStatus.BAD_REQUEST,
            );
        }
    }

    checkUserExits(email: string): Promise<User | null> {
        try {
            return this.userRepository.findOne({
                where: { email },
            });
        } catch (error) {
            console.log(error);
            throw new BadGatewayException();
        }
    }

    generateHashPassword(password: string): Promise<string> {
        return bcrypt.hash(password, saltOrRounds);
    }

    async generateToken(payload: IJwtPayload) {
        const dataPayload: IJwtPayload = {
            role: payload.role,
            id: payload.id,
            email: payload.email,
            fistName: payload.fistName,
            lastName: payload.lastName,
            is_login_fire_base: payload.is_login_fire_base,
        };

        const access_token = await this.jwtService.signAsync(dataPayload, {
            expiresIn: '24h',
        });
        const refresh_token = await this.jwtService.signAsync(dataPayload, {
            expiresIn: '365d',
        });

        return {
            access_token,
            refresh_token,
        };
    }

    handleSenToken(token: { access_token: string; refresh_token: string }, Req: Request, Res: Response): void {
        Res.cookie('access_token', token.access_token, {
            httpOnly: true,
            path: '/',
            sameSite: 'strict',
            secure: true,
            maxAge: new Date(Number(new Date()) + 31536000000).getTime(),
        });

        Res.cookie('refresh_token', token.refresh_token, {
            httpOnly: true,
            path: '/',
            sameSite: 'strict',
            secure: true,
            maxAge: new Date(Number(new Date()) + 31536000000).getTime(),
        });
    }
}
