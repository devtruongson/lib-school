import { Body, Controller, Get, Post, Req, Res } from '@nestjs/common';
import { AuthService } from './auth.service';
import { registerDTO } from './DTO/register.dto';
import { Response, Request } from 'express';

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) {}

    @Post('register')
    registerUser(@Body() userDTO: registerDTO, @Req() req: Request, @Res() res: Response) {
        return this.authService.registerUser(userDTO, req, res);
    }

    @Get()
    get() {
        console.log('update');
        return 'Xin Chao';
    }
}
