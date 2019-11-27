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
const operators_1 = require("rxjs/operators");
const core_1 = require("@nestjs/core");
const common_1 = require("@nestjs/common");
const http_interface_1 = require("@/interfaces/http.interface");
const HTTP = require("@/constants/http.constant");
function transformDataToPaginate(data, request) {
    return {
        list: data.docs,
        totalCount: data.total
    };
}
exports.transformDataToPaginate = transformDataToPaginate;
let TransformInterceptor = class TransformInterceptor {
    constructor(reflector) {
        this.reflector = reflector;
    }
    intercept(context, next) {
        const call$ = next.handle();
        const target = context.getHandler();
        const request = context.switchToHttp().getRequest();
        const message = this.reflector.get(HTTP.HTTP_SUCCESS_MESSAGE, target) || HTTP.HTTP_DEFAULT_SUCCESS_TEXT;
        const usePaginate = this.reflector.get(HTTP.HTTP_RES_TRANSFORM_PAGINATE, target);
        return call$.pipe(operators_1.map((data) => {
            const result = !usePaginate ? data : transformDataToPaginate(data, request);
            return { status: http_interface_1.EHttpStatus.Success, message, result };
        }));
    }
};
TransformInterceptor = __decorate([
    common_1.Injectable(),
    __metadata("design:paramtypes", [core_1.Reflector])
], TransformInterceptor);
exports.TransformInterceptor = TransformInterceptor;
//# sourceMappingURL=transform.interceptor.js.map