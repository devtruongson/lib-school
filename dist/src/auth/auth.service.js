"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const User_1 = require("../typeorm/entities/User");
const typeorm_2 = require("typeorm");
const exceptions_1 = require("../helpers/exceptions");
const bcrypt = require("bcrypt");
const jwt_1 = require("@nestjs/jwt");
const uuid_1 = require("uuid");
const slugify_1 = require("slugify");
const sendResponse_1 = require("../helpers/sendResponse");
const Profile_1 = require("../typeorm/entities/Profile");
const saltOrRounds = 10;
let AuthService = class AuthService {
    constructor(userRepository, profileRepository, jwtService) {
        this.userRepository = userRepository;
        this.profileRepository = profileRepository;
        this.jwtService = jwtService;
    }
    async registerUser(userDTO, req, res) {
        const checkUserExits = await this.checkUserExits(userDTO.email);
        if (checkUserExits) {
            throw new exceptions_1.UserExitsException();
        }
        const passwordHash = await this.generateHashPassword(userDTO.password);
        try {
            const newUser = this.userRepository.create({
                email: userDTO.email,
                password: passwordHash,
                fistName: userDTO.firstName,
                lastName: userDTO.lastName,
                slug: (0, slugify_1.default)(`${userDTO.firstName} ${userDTO.lastName} ${(0, uuid_1.v4)()}`),
            });
            const userSave = await this.userRepository.save(newUser);
            delete userSave.password;
            const Token = await this.generateToken(userSave);
            this.handleSenToken(Token, req, res);
            res.status(common_1.HttpStatus.OK).json((0, sendResponse_1.sendResponse)({
                statusCode: common_1.HttpStatus.OK,
                data: {
                    user: userSave,
                },
                message: 'You have successfully registered | Bạn đã đăng ký thành công!',
            }));
        }
        catch (error) {
            console.log(error);
            throw new common_1.HttpException('An error occurred, please try again | Có lỗi xảy ra vui lòng thử lại!', common_1.HttpStatus.BAD_REQUEST);
        }
    }
    async signInWithFireBase(signInFireBase, req, res) {
        const checkUserExits = await this.checkUserExits(signInFireBase.email);
        if (checkUserExits && !checkUserExits.is_login_fire_base) {
            throw new common_1.HttpException('Tài khoản của bạn phải đăng nhập bằng mật khẩu', common_1.HttpStatus.BAD_REQUEST);
        }
        if (checkUserExits && checkUserExits.is_login_fire_base) {
            delete checkUserExits.password;
            const Token = await this.generateToken(checkUserExits);
            this.handleSenToken(Token, req, res);
            return res.status(common_1.HttpStatus.OK).json((0, sendResponse_1.sendResponse)({
                statusCode: common_1.HttpStatus.OK,
                data: {
                    user: checkUserExits,
                },
                message: 'You have successfully login | Bạn đã đăng nhập thành công!',
            }));
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
            slug: (0, slugify_1.default)(`${signInFireBase.lastName} ${(0, uuid_1.v4)()}`),
            is_verify_email: true,
        });
        const userSave = await this.userRepository.save(newUser);
        return res.status(common_1.HttpStatus.OK).json((0, sendResponse_1.sendResponse)({
            statusCode: common_1.HttpStatus.OK,
            data: {
                user: userSave,
            },
            message: 'You have successfully login | Bạn đã đăng nhập thành công!',
        }));
    }
    checkUserExits(email) {
        try {
            return this.userRepository.findOne({
                where: { email },
            });
        }
        catch (error) {
            console.log(error);
            throw new common_1.BadGatewayException();
        }
    }
    generateHashPassword(password) {
        return bcrypt.hash(password, saltOrRounds);
    }
    async generateToken(payload) {
        const dataPayload = {
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
    handleSenToken(token, Req, Res) {
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
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(User_1.User)),
    __param(1, (0, typeorm_1.InjectRepository)(Profile_1.Profile)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        jwt_1.JwtService])
], AuthService);
//# sourceMappingURL=auth.service.js.map