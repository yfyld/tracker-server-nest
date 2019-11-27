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
const common_1 = require("@nestjs/common");
const core_1 = require("@nestjs/core");
const forbidden_error_1 = require("@/errors/forbidden.error");
let PermissionsGuard = class PermissionsGuard {
    constructor(reflector) {
        this.reflector = reflector;
    }
    canActivate(context) {
        const permissions = [
            ...(this.reflector.get('permissions', context.getClass()) || []),
            ...(this.reflector.get('permissions', context.getHandler()) || [])
        ];
        if (permissions.length === 0) {
            return true;
        }
        const request = context.switchToHttp().getRequest();
        const user = request.user;
        if (!user || !user.permissions) {
            this.handleError();
            return false;
        }
        const hasPermission = () => user.permissions.some(permission => permissions.includes(permission));
        if (hasPermission()) {
            return true;
        }
        if (request.params.projectId) {
            return true;
        }
        this.handleError();
        return false;
    }
    handleError() {
        throw new forbidden_error_1.HttpForbiddenError();
    }
};
PermissionsGuard = __decorate([
    common_1.Injectable(),
    __metadata("design:paramtypes", [core_1.Reflector])
], PermissionsGuard);
exports.PermissionsGuard = PermissionsGuard;
//# sourceMappingURL=permission.guard.js.map