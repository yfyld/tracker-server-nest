"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const common_1 = require("@nestjs/common");
exports.Cookie = common_1.createParamDecorator((data, req) => {
    return req.cookies;
});
//# sourceMappingURL=cookie.decorators.js.map