"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const HTTP = require("@/constants/http.constant");
const common_1 = require("@nestjs/common");
class HttpBadRequestError extends common_1.HttpException {
    constructor(error) {
        super(error || HTTP.HTTP_BAD_REQUEST_TEXT_DEFAULT, common_1.HttpStatus.BAD_REQUEST);
    }
}
exports.HttpBadRequestError = HttpBadRequestError;
//# sourceMappingURL=bad-request.error.js.map