"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const HTTP = require("@/constants/http.constant");
const common_1 = require("@nestjs/common");
class ValidationError extends common_1.HttpException {
    constructor(error) {
        super(error || HTTP.VALIDATION_ERROR_DEFAULT, common_1.HttpStatus.BAD_REQUEST);
    }
}
exports.ValidationError = ValidationError;
//# sourceMappingURL=validation.error.js.map