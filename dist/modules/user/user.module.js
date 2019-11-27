"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
const common_1 = require("@nestjs/common");
const user_controller_1 = require("./user.controller");
const user_service_1 = require("./user.service");
const user_model_1 = require("./user.model");
const jwt_strategy_1 = require("./jwt.strategy");
const app_config_1 = require("@/app.config");
const jwt_1 = require("@nestjs/jwt");
const passport_1 = require("@nestjs/passport");
const typeorm_1 = require("@nestjs/typeorm");
const core_1 = require("@nestjs/core");
const validation_pipe_1 = require("@/pipes/validation.pipe");
let UserModule = class UserModule {
};
UserModule = __decorate([
    common_1.Module({
        imports: [
            typeorm_1.TypeOrmModule.forFeature([user_model_1.UserModel, user_model_1.RoleModel, user_model_1.PermissionModel]),
            passport_1.PassportModule.register({ defaultStrategy: 'jwt' }),
            jwt_1.JwtModule.register({
                secretOrPrivateKey: app_config_1.AUTH.jwtTokenSecret,
                signOptions: { expiresIn: app_config_1.AUTH.expiresIn }
            })
        ],
        providers: [
            user_service_1.UserService,
            jwt_strategy_1.JwtStrategy,
            {
                provide: core_1.APP_PIPE,
                useClass: validation_pipe_1.ValidationPipe
            }
        ],
        controllers: [user_controller_1.UserController],
        exports: [user_service_1.UserService]
    })
], UserModule);
exports.UserModule = UserModule;
//# sourceMappingURL=user.module.js.map