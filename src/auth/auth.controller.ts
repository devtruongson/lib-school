import { Body, Controller, Post, Req, Res } from '@nestjs/common';
import { AuthService } from './auth.service';
import { registerDTO } from './DTO/register.dto';
import { Response, Request } from 'express';
import { signInFireBaseDTO } from './DTO/signInFireBase.dto';

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
}
