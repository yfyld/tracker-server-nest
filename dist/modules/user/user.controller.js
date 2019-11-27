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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
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
const query_list_decorators_1 = require("./../../decotators/query-list.decorators");
const user_decorators_1 = require("@/decotators/user.decorators");
const common_1 = require("@nestjs/common");
const user_model_1 = require("./user.model");
const user_service_1 = require("./user.service");
const http_decotator_1 = require("@/decotators/http.decotator");
const auth_guard_1 = require("@/guards/auth.guard");
const swagger_1 = require("@nestjs/swagger");
const user_dto_1 = require("./user.dto");
const common_2 = require("@nestjs/common");
let UserController = class UserController {
    constructor(userService) {
        this.userService = userService;
    }
    getRoles() {
        return this.userService.getRoles();
    }
    checkToken() {
        return 'ok';
    }
    signin(body) {
        return this.userService.signin(body);
    }
    signup(user) {
        return __awaiter(this, void 0, void 0, function* () {
            const newUser = yield this.userService.addUser(user);
            return this.userService.createToken(newUser);
        });
    }
    updateUser(body, user) {
        return this.userService.updateUser(body, user.id);
    }
    getUserInfo(user) {
        return this.userService.getUserByUsername(user.username);
    }
    getUsers(query) {
        return this.userService.getUsers(query);
    }
};
__decorate([
    swagger_1.ApiOperation({ title: '获取权限列表', description: '' }),
    swagger_1.ApiBearerAuth(),
    swagger_1.ApiResponse({ status: 200, type: user_model_1.RoleModel, isArray: true }),
    http_decotator_1.HttpProcessor.handle('获取权限列表'),
    common_1.Get('/role'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], UserController.prototype, "getRoles", null);
__decorate([
    swagger_1.ApiOperation({ title: '检测 Token', description: '' }),
    common_1.Post('check'),
    http_decotator_1.HttpProcessor.handle('检测 Token'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", String)
], UserController.prototype, "checkToken", null);
__decorate([
    swagger_1.ApiOperation({ title: '登陆', description: '' }),
    common_1.Post('/signin'),
    http_decotator_1.HttpProcessor.handle({ message: '登陆', error: common_1.HttpStatus.BAD_REQUEST }),
    __param(0, common_1.Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [user_dto_1.SigninDto]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "signin", null);
__decorate([
    swagger_1.ApiOperation({ title: '注册', description: '' }),
    http_decotator_1.HttpProcessor.handle('注册'),
    common_1.Post('/signup'),
    __param(0, common_1.Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [user_dto_1.SignupDto]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "signup", null);
__decorate([
    swagger_1.ApiOperation({ title: '修改用户信息', description: '' }),
    http_decotator_1.HttpProcessor.handle('修改用户信息'),
    common_1.UseGuards(auth_guard_1.JwtAuthGuard),
    common_1.Put('/'),
    __param(0, common_1.Body()), __param(1, user_decorators_1.Auth()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [user_dto_1.UpdateUserDto, user_model_1.UserModel]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "updateUser", null);
__decorate([
    common_2.UseInterceptors(common_1.ClassSerializerInterceptor),
    swagger_1.ApiOperation({ title: '获取用户信息', description: '' }),
    swagger_1.ApiBearerAuth(),
    swagger_1.ApiResponse({ status: 200, type: user_model_1.UserModel }),
    http_decotator_1.HttpProcessor.handle('获取用户信息'),
    common_1.Get('/info'),
    common_1.UseGuards(auth_guard_1.JwtAuthGuard),
    __param(0, user_decorators_1.Auth()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [user_model_1.UserModel]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "getUserInfo", null);
__decorate([
    swagger_1.ApiOperation({ title: '获取用户列表', description: '' }),
    swagger_1.ApiBearerAuth(),
    swagger_1.ApiResponse({ status: 200, type: user_model_1.UserModel }),
    http_decotator_1.HttpProcessor.handle('获取用户列表'),
    common_1.UseGuards(auth_guard_1.JwtAuthGuard),
    common_1.Get('/'),
    __param(0, query_list_decorators_1.QueryList()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "getUsers", null);
UserController = __decorate([
    swagger_1.ApiUseTags('账号权限'),
    common_1.Controller('user'),
    __metadata("design:paramtypes", [user_service_1.UserService])
], UserController);
exports.UserController = UserController;
//# sourceMappingURL=user.controller.js.map