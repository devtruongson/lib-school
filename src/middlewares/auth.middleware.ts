import { HttpException, HttpStatus, Injectable, NestMiddleware, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { NextFunction, Request, Response } from 'express';
import { isEmpty } from 'lodash';

@Injectable()
export class AuthMiddleware implements NestMiddleware {
    constructor(private readonly jwtService: JwtService) {}

    async use(req: Request, res: Response, next: NextFunction) {
        if (req && !isEmpty(req.cookies)) {
            const access_token = req.cookies.access_token;
            const refresh_token = req.cookies.refresh_token;

            if (!access_token || !refresh_token) {
                throw new HttpException(
                    'Access_Token and refresh_token are a required parameter | Access_Token và refresh_token là tham số bắt buộc!',
                    HttpStatus.UNAUTHORIZED,
                );
            }

            try {
                const checkAccessToken = await this.jwtService.verifyAsync(access_token, {
                    ignoreExpiration: true,
                });
                const checkRefreshToken = await this.jwtService.verifyAsync(refresh_token);

                if (checkRefreshToken.id === checkAccessToken.id) {
                    req.user = checkAccessToken;
                    next();
                } else {
                    throw new UnauthorizedException();
                }
            } catch (error) {
                throw new HttpException(
                    'Your access_token has expired, please try again later | Access_token của bạn đã hết hạn vui lòng thử lại sau!',
                    HttpStatus.FORBIDDEN,
                );
            }
        } else {
            throw new UnauthorizedException();
        }
    }
}
