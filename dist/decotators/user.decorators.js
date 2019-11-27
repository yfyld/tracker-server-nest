"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const common_1 = require("@nestjs/common");
exports.Auth = common_1.createParamDecorator((data, req) => {
    return req.user;
});
//# sourceMappingURL=user.decorators.js.map