"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
const lodash = require("lodash");
const app_environment_1 = require("@/app.environment");
const common_1 = require("@nestjs/common");
let HttpExceptionFilter = class HttpExceptionFilter {
    catch(exception, host) {
        const request = host.switchToHttp().getRequest();
        const response = host.switchToHttp().getResponse();
        const status = (exception.getStatus && exception.getStatus()) || common_1.HttpStatus.INTERNAL_SERVER_ERROR;
        const errorOption = exception.getResponse
            ? exception.getResponse()
            : exception;
        const isString = (value) => lodash.isString(value);
        const errMessage = isString(errorOption) ? errorOption : errorOption.message;
        const errorInfo = isString(errorOption) ? null : errorOption.error;
        const parentErrorInfo = errorInfo ? String(errorInfo) : null;
        const isChildrenError = errorInfo && errorInfo.status && errorInfo.message;
        const resultError = (isChildrenError && errorInfo.message) || parentErrorInfo;
        const resultStatus = isChildrenError ? errorInfo.status : status;
        const data = {
            status: resultStatus,
            message: errMessage,
            error: resultError,
            debug: app_environment_1.isDevMode ? exception.stack : null
        };
        if (status === common_1.HttpStatus.NOT_FOUND) {
            data.error = `资源不存在`;
            data.message = `接口 ${request.method} -> ${request.url} 无效`;
        }
        return response.status(common_1.HttpStatus.OK).jsonp(data);
    }
};
HttpExceptionFilter = __decorate([
    common_1.Catch()
], HttpExceptionFilter);
exports.HttpExceptionFilter = HttpExceptionFilter;
//# sourceMappingURL=error.filter.js.map