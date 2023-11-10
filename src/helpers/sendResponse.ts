import { IRes } from 'src/utils/interface';
export function sendResponse(responseData: IRes): IRes {
    return {
        statusCode: responseData.statusCode,
        message: responseData.message,
        data: responseData.data,
    };
}
