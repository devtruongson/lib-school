import { HttpException, HttpStatus, Injectable, NestMiddleware, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { NextFunction, Request, Response } from 'express';
import { isEmpty } from 'lodash';
import { IJwtPayload } from 'src/utils/interface';

@Injectable()
export class JwtMiddleware implements NestMiddleware {
    constructor(private readonly jwtService: JwtService) {}

    async use(req: Request, res: Response, next: NextFunction) {
        if (req && !isEmpty(req.cookies)) {
            const access_token = req.cookies.access_token;

            if (!access_token) {
                throw new HttpException(
                    'Access_Token is a required parameter | Access_Token là tham số bắt buộc!',
                    HttpStatus.UNAUTHORIZED,
                );
            }

            try {
                const checkAccessToken: IJwtPayload = await this.jwtService.verifyAsync(access_token);
                req.user = checkAccessToken;
                next();
            } catch (error) {
                throw new HttpException(
                    'Your access_token has expired, please try again later | Access_token của bạn đã hết hạn vui lòng thử lại sau!',
                    HttpStatus.UNAUTHORIZED,
                );
            }
        } else {
            throw new UnauthorizedException();
        }
    }
}
