import { HttpStatus } from '@nestjs/common';
export function sendResponse(responseData: { data?: any; statusCode: HttpStatus; message: string }) {
    return {
        statusCode: responseData.statusCode,
        message: responseData.message,
        data: responseData.data,
    };
}
