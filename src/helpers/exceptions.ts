import { HttpException, HttpStatus } from '@nestjs/common';

export class UserExitsException extends HttpException {
    constructor() {
        super('Email Bạn Đăng Ký Đã Tồn Tại Trong Hệ Thống', HttpStatus.BAD_REQUEST);
    }
}

export class UserNotExitsException extends HttpException {
    constructor() {
        super('Tài khoản của bạn không tồn tại trong hệ thống!', HttpStatus.BAD_REQUEST);
    }
}
