"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const HTTP = require("@/constants/http.constant");
const common_1 = require("@nestjs/common");
class HttpForbiddenError extends common_1.HttpException {
    constructor(error) {
        super(error || HTTP.HTTP_PERMISSION_ERROR_DEFAULT, common_1.HttpStatus.FORBIDDEN);
    }
}
exports.HttpForbiddenError = HttpForbiddenError;
//# sourceMappingURL=forbidden.error.js.map