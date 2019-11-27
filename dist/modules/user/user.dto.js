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
const class_validator_1 = require("class-validator");
const swagger_1 = require("@nestjs/swagger");
class SigninDto {
}
__decorate([
    swagger_1.ApiModelProperty(),
    class_validator_1.IsNotEmpty({ message: '账号不能为空' }),
    class_validator_1.IsString({ message: '账号必须为字符串' }),
    __metadata("design:type", String)
], SigninDto.prototype, "username", void 0);
__decorate([
    swagger_1.ApiModelProperty(),
    class_validator_1.IsNotEmpty({ message: '账号不能为空' }),
    class_validator_1.IsString({ message: '账号必须为字符串' }),
    class_validator_1.Length(6, 50, { message: '至少6个字符组成' }),
    __metadata("design:type", String)
], SigninDto.prototype, "password", void 0);
exports.SigninDto = SigninDto;
class TokenDto {
}
__decorate([
    swagger_1.ApiModelProperty(),
    __metadata("design:type", String)
], TokenDto.prototype, "accessToken", void 0);
__decorate([
    swagger_1.ApiModelProperty(),
    __metadata("design:type", Number)
], TokenDto.prototype, "expiresIn", void 0);
exports.TokenDto = TokenDto;
class SignupDto {
}
__decorate([
    swagger_1.ApiModelProperty(),
    class_validator_1.IsNotEmpty({ message: '账号不能为空' }),
    class_validator_1.IsString({ message: '账号必须为字符串' }),
    __metadata("design:type", String)
], SignupDto.prototype, "username", void 0);
__decorate([
    swagger_1.ApiModelProperty(),
    class_validator_1.IsString({ message: '账号必须为字符串' }),
    __metadata("design:type", String)
], SignupDto.prototype, "nickname", void 0);
__decorate([
    swagger_1.ApiModelProperty(),
    class_validator_1.IsNotEmpty({ message: '账号不能为空' }),
    class_validator_1.IsString({ message: '账号必须为字符串' }),
    class_validator_1.Length(6, 50, { message: '至少6个字符组成' }),
    __metadata("design:type", String)
], SignupDto.prototype, "password", void 0);
exports.SignupDto = SignupDto;
class UpdateUserDto {
}
__decorate([
    swagger_1.ApiModelProperty(),
    class_validator_1.IsString({ message: '账号必须为字符串' }),
    __metadata("design:type", String)
], UpdateUserDto.prototype, "nickname", void 0);
__decorate([
    swagger_1.ApiModelProperty(),
    class_validator_1.IsString({ message: '邮箱必须为字符串' }),
    __metadata("design:type", String)
], UpdateUserDto.prototype, "email", void 0);
__decorate([
    swagger_1.ApiModelProperty(),
    class_validator_1.IsString({ message: '手机号号必须为字符串' }),
    __metadata("design:type", String)
], UpdateUserDto.prototype, "mobile", void 0);
exports.UpdateUserDto = UpdateUserDto;
class UserListReqDto {
}
__decorate([
    swagger_1.ApiModelProperty(),
    __metadata("design:type", String)
], UserListReqDto.prototype, "name", void 0);
exports.UserListReqDto = UserListReqDto;
//# sourceMappingURL=user.dto.js.map