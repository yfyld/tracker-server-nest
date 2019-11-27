"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const HTTP = require("@/constants/http.constant");
const common_1 = require("@nestjs/common");
class HttpUnauthorizedError extends common_1.UnauthorizedException {
    constructor(message, error) {
        super(message || HTTP.HTTP_UNAUTHORIZED_TEXT_DEFAULT, error);
    }
}
exports.HttpUnauthorizedError = HttpUnauthorizedError;
//# sourceMappingURL=unauthorized.error.js.map