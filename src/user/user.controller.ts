import { Controller, Get, Req } from '@nestjs/common';
import { UserService } from './user.service';
import { Request } from 'express';

@Controller('user')
export class UserController {
    constructor(private readonly userService: UserService) {}

    @Get('/current-role')
    getCurrentRole(@Req() req: Request) {
        return this.userService.getCurrentRole(req);
    }
}
