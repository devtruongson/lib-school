"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserExitsException = void 0;
const common_1 = require("@nestjs/common");
class UserExitsException extends common_1.HttpException {
    constructor() {
        super('Email Bạn Đăng Ký Đã Tồn Tại Trong Hệ Thống', common_1.HttpStatus.BAD_REQUEST);
    }
}
exports.UserExitsException = UserExitsException;
//# sourceMappingURL=exceptions.js.map