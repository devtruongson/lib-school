import { HttpStatus } from '@nestjs/common';
export declare function sendResponse(responseData: {
    data?: any;
    statusCode: HttpStatus;
    message: string;
}): {
    statusCode: HttpStatus;
    message: string;
    data: any;
};
