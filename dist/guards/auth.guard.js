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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const user_service_1 = require("./../modules/user/user.service");
const passport_1 = require("@nestjs/passport");
const common_1 = require("@nestjs/common");
const unauthorized_error_1 = require("@/errors/unauthorized.error");
const passport_jwt_1 = require("passport-jwt");
let JwtAuthGuard = class JwtAuthGuard extends passport_1.AuthGuard('jwt') {
    constructor(userService) {
        super();
        this.userService = userService;
    }
    canActivate(context) {
        const _super = Object.create(null, {
            canActivate: { get: () => super.canActivate }
        });
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield _super.canActivate.call(this, context);
            }
            catch (TokenExpiredError) {
                if (TokenExpiredError.response.error === 'jwt expired') {
                    const request = context.switchToHttp().getRequest();
                    const token = passport_jwt_1.ExtractJwt.fromAuthHeaderAsBearerToken()(request);
                    const result = yield this.userService.refreshToken(token);
                    if (result) {
                        request.headers.authorization = `Bearer ${result.accessToken}`;
                        return yield _super.canActivate.call(this, context);
                    }
                }
                return false;
            }
        });
    }
    handleRequest(error, authInfo, errInfo) {
        if (authInfo && !error && !errInfo) {
            return authInfo;
        }
        else {
            throw error || new unauthorized_error_1.HttpUnauthorizedError(null, errInfo && errInfo.message);
        }
    }
};
JwtAuthGuard = __decorate([
    common_1.Injectable(),
    __metadata("design:paramtypes", [user_service_1.UserService])
], JwtAuthGuard);
exports.JwtAuthGuard = JwtAuthGuard;
//# sourceMappingURL=auth.guard.js.map