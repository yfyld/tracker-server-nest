"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
const rxjs_1 = require("rxjs");
const operators_1 = require("rxjs/operators");
const core_1 = require("@nestjs/core");
const common_1 = require("@nestjs/common");
const custom_error_1 = require("@/errors/custom.error");
const HTTP = require("@/constants/http.constant");
let ErrorInterceptor = class ErrorInterceptor {
    constructor(reflector) {
        this.reflector = reflector;
    }
    intercept(context, next) {
        const call$ = next.handle();
        const target = context.getHandler();
        const statusCode = this.reflector.get(HTTP.HTTP_ERROR_CODE, target);
        const message = this.reflector.get(HTTP.HTTP_ERROR_MESSAGE, target) || HTTP.HTTP_DEFAULT_ERROR_TEXT;
        return call$.pipe(operators_1.catchError(error => rxjs_1.throwError(new custom_error_1.CustomError({ message, error }, statusCode))));
    }
};
ErrorInterceptor = __decorate([
    common_1.Injectable(),
    __metadata("design:paramtypes", [core_1.Reflector])
], ErrorInterceptor);
exports.ErrorInterceptor = ErrorInterceptor;
//# sourceMappingURL=error.intercptor.js.map