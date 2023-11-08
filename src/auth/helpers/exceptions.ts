import { HttpException, HttpStatus } from '@nestjs/common';

export class UserExitsException extends HttpException {
    constructor() {
        super('Email Bạn Đăng Ký Đã Tồn Tại Trong Hệ Thống', HttpStatus.BAD_REQUEST);
    }
}
