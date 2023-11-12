import {
    Body,
    ClassSerializerInterceptor,
    Controller,
    DefaultValuePipe,
    Get,
    ParseIntPipe,
    Post,
    Query,
    Req,
    UseInterceptors,
} from '@nestjs/common';
import { UserService } from './user.service';
import { Request } from 'express';
import { Pagination } from 'nestjs-typeorm-paginate';
import { User } from 'src/typeorm/entities/User';
import { ConfigEnum } from 'src/utils/enum';
import { sendEmailUserDTO } from './dto/sendEmailUser.dto';
import { IRes } from 'src/utils/interface';

@Controller('user')
export class UserController {
    constructor(private readonly userService: UserService) {}

    @Get('/current-role')
    getCurrentRole(@Req() req: Request) {
        return this.userService.getCurrentRole(req);
    }

    @Get()
    @UseInterceptors(ClassSerializerInterceptor)
    getAllUsers(
        @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number = 1,
        @Query('pageSize', new DefaultValuePipe(1), ParseIntPipe) pageSize: number = 1,
    ): Promise<Pagination<User>> {
        return this.userService.getAllUsers({
            limit: pageSize,
            page: page,
            cacheQueries: true,
            route: ConfigEnum.URL_BE_USER_GET_ALL,
        });
    }

    @Post('/send-email')
    sendEmailUser(@Body() sendEmailUser: sendEmailUserDTO): Promise<IRes> {
        return this.userService.sendEmailUser(sendEmailUser);
    }
}
