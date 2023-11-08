"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendResponse = void 0;
function sendResponse(responseData) {
    return {
        statusCode: responseData.statusCode,
        message: responseData.message,
        data: responseData.data,
    };
}
exports.sendResponse = sendResponse;
//# sourceMappingURL=sendResponse.js.map