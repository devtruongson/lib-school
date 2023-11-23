import { Body, Controller, Get, Post, Query, Req, Res } from '@nestjs/common';
import { AuthService } from './auth.service';
import { registerDTO } from './DTO/register.dto';
import { Response, Request } from 'express';
import { signInFireBaseDTO } from './DTO/signInFireBase.dto';
import { loginDTO } from './DTO/login.dto';

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) {}

    @Post('register')
    registerUser(@Body() userDTO: registerDTO, @Req() req: Request, @Res() res: Response) {
        return this.authService.registerUser(userDTO, req, res);
    }

    @Post('fire-base')
    signInWithFireBase(@Body() signInFireBase: signInFireBaseDTO, @Req() req: Request, @Res() res: Response) {
        return this.authService.signInWithFireBase(signInFireBase, req, res);
    }

    @Post('/login')
    login(@Body() loginData: loginDTO, @Req() req: Request, @Res() res: Response) {
        return this.authService.login(loginData, req, res);
    }

    @Get('verify')
    verifyAccount(@Query('token') token: string, @Res() res: Response): Promise<any> {
        return this.authService.verifyAccount(token, res);
    }

    @Post('refresh-token')
    refreshToken(@Req() req: Request, @Res() res: Response): Promise<any> {
        return this.authService.refreshToken(req, res);
    }

    @Get('/logout')
    handleLogout(@Req() req: Request, @Res() res: Response) {
        res.clearCookie('access_token');
        res.clearCookie('refresh_token');
        return res.status(200).json({
            statusCode: 200,
        });
    }
}
