import { BadGatewayException, HttpException, HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/typeorm/entities/User';
import { Repository } from 'typeorm';
import { registerDTO } from './DTO/register.dto';
import { UserExitsException, UserNotExitsException } from 'src/helpers/exceptions';
import { Request, Response } from 'express';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { IJwtPayload } from 'src/utils/interface';
import { v4 as uuid4 } from 'uuid';
import slugify from 'slugify';
import { sendResponse } from 'src/helpers/sendResponse';
import { signInFireBaseDTO } from './DTO/signInFireBase.dto';
import { Profile } from 'src/typeorm/entities/Profile';
import { loginDTO } from './DTO/login.dto';
import { v4 as uuidv4 } from 'uuid';
import { MailerService } from 'src/mailer/mailer.service';

const saltOrRounds: number = 10;
@Injectable()
export class AuthService {
    constructor(
        @InjectRepository(User) private readonly userRepository: Repository<User>,
        @InjectRepository(Profile) private readonly profileRepository: Repository<Profile>,
        private readonly jwtService: JwtService,
        private readonly mailerService: MailerService,
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
                uuid_code: uuidv4(),
            });

            const userSave: User = await this.userRepository.save(newUser);
            await this.emailVerifyAccount(userSave);
            delete userSave.password;
            delete userSave.uuid_code;
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

    async signInWithFireBase(signInFireBase: signInFireBaseDTO, req: Request, res: Response) {
        const checkUserExits: User | null = await this.checkUserExits(signInFireBase.email);

        if (checkUserExits && !checkUserExits.is_login_fire_base) {
            throw new HttpException('Tài khoản của bạn phải đăng nhập bằng mật khẩu', HttpStatus.BAD_REQUEST);
        }

        if (checkUserExits && checkUserExits.is_login_fire_base) {
            delete checkUserExits.password;
            delete checkUserExits.uuid_code;
            const Token: { access_token: string; refresh_token: string } = await this.generateToken(checkUserExits);
            this.handleSenToken(Token, req, res);
            return res.status(HttpStatus.OK).json(
                sendResponse({
                    statusCode: HttpStatus.OK,
                    data: {
                        user: checkUserExits,
                    },
                    message: 'You have successfully login | Bạn đã đăng nhập thành công!',
                }),
            );
        }

        const newProfile = this.profileRepository.create({
            avatar_url: signInFireBase.avatar_url,
        });
        const saveProfile = await this.profileRepository.save(newProfile);
        const passwordHash = await this.generateHashPassword('null');

        const newUser = this.userRepository.create({
            email: signInFireBase.email,
            profile: saveProfile,
            fistName: 'user',
            lastName: signInFireBase.lastName,
            password: passwordHash,
            slug: slugify(`${signInFireBase.lastName} ${uuid4()}`),
            is_verify_email: true,
            is_login_fire_base: true,
            uuid_code: uuid4(),
        });
        const userSave = await this.userRepository.save(newUser);
        delete userSave.uuid_code;
        delete userSave.password;
        const Token: { access_token: string; refresh_token: string } = await this.generateToken(userSave);
        this.handleSenToken(Token, req, res);
        return res.status(HttpStatus.OK).json(
            sendResponse({
                statusCode: HttpStatus.OK,
                data: {
                    user: userSave,
                },
                message: 'You have successfully login | Bạn đã đăng nhập thành công!',
            }),
        );
    }

    async login(data: loginDTO, req: Request, res: Response): Promise<any> {
        const checkUserExits: User = await this.checkUserExits(data.email);

        if (!checkUserExits) {
            throw new UserNotExitsException();
        } else if (checkUserExits.is_login_fire_base) {
            throw new HttpException('Tài khoản của bạn phải đăng nhập bằng google!', HttpStatus.BAD_REQUEST);
        }

        const checkPass: boolean = await this.checkPassword(data.password, checkUserExits.password);

        if (!checkPass) {
            throw new HttpException('Wrong password', HttpStatus.BAD_REQUEST);
        }
        if (!checkUserExits.is_verify_email) {
            await this.emailVerifyAccount(checkUserExits);
        }
        delete checkUserExits.password;
        delete checkUserExits.uuid_code;
        const Token: { access_token: string; refresh_token: string } = await this.generateToken(checkUserExits);
        this.handleSenToken(Token, req, res);
        return res.status(HttpStatus.OK).json(
            sendResponse({
                statusCode: HttpStatus.OK,
                data: {
                    user: checkUserExits,
                },
                message: 'You have successfully login | Bạn đã đăng nhập thành công!',
            }),
        );
    }

    async verifyAccount(token: string, res: Response) {
        if (!token) {
            throw new NotFoundException();
        }

        const userCheck: User | null = await this.userRepository.findOne({
            where: {
                uuid_code: token,
            },
        });

        if (!userCheck) {
            throw new UserNotExitsException();
        }

        await this.userRepository.update(userCheck.id, {
            is_verify_email: true,
        });
        return res.redirect(process.env.url_fe);
    }

    async refreshToken(req: Request, res: Response): Promise<any> {
        const user = req.user as IJwtPayload;

        const checkUserExits: User | null = await this.checkUserExits(user.email)
        if(!checkUserExits) {
            throw new UserNotExitsException()
        }

        delete checkUserExits.password;
        delete checkUserExits.uuid_code;
        const Token: { access_token: string; refresh_token: string } = await this.generateToken(checkUserExits);
        this.handleSenToken(Token, req, res);
        return res.status(HttpStatus.OK).json(
            sendResponse({
                statusCode: HttpStatus.OK,
                message: 'Đã RefreshToken Thành Công!',
            }),
        );
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

    emailVerifyAccount(user: User): Promise<any> {
        const url_be: string = process.env.evironment === 'dev' ? process.env.url_dev : process.env.url_pro;
        const token_url: string = `${url_be}/api/v1/auth/verify?token=${user.uuid_code}`;
        return this.mailerService.emailVerifyAccount({
            email: user.email,
            token_url,
        });
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

    checkPassword(password: string, hashPassword: string): Promise<boolean> {
        return bcrypt.compare(password, hashPassword);
    }
}
