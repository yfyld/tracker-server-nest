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
const user_model_1 = require("./user.model");
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
const js_base64_1 = require("js-base64");
const crypto_1 = require("crypto");
const app_config_1 = require("@/app.config");
const typeorm_1 = require("typeorm");
const typeorm_2 = require("@nestjs/typeorm");
let UserService = class UserService {
    constructor(userModel, roleModel, jwtService) {
        this.userModel = userModel;
        this.roleModel = roleModel;
        this.jwtService = jwtService;
    }
    encodeBase64(password) {
        return password ? js_base64_1.Base64.encode(password) : password;
    }
    encodeMd5(password) {
        return crypto_1.createHash('md5')
            .update(password)
            .digest('hex');
    }
    getPermissionsById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield this.userModel
                .createQueryBuilder('user')
                .leftJoinAndSelect('user.roles', 'role')
                .leftJoinAndSelect('role.permissions', 'permission')
                .where('user.id = :id', { id })
                .getOne();
            const permissionList = user.roles.reduce((total, item) => {
                return total.concat(item.permissions);
            }, []);
            return permissionList;
        });
    }
    createToken(user) {
        return __awaiter(this, void 0, void 0, function* () {
            const permissions = yield this.getPermissionsById(user.id);
            const data = {
                username: user.username,
                id: user.id,
                password: user.password,
                permissions: permissions.map(item => item.code)
            };
            const accessToken = this.jwtService.sign({ data });
            return Promise.resolve({ accessToken, expiresIn: app_config_1.AUTH.expiresIn });
        });
    }
    refreshToken(token) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const data = JSON.parse(this.encodeBase64(token.split('.')[1]));
                const user = yield this.userModel.findOne(data.id);
                return this.createToken(user);
            }
            catch (error) {
                return null;
            }
        });
    }
    validateAuthData(payload) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield this.userModel.findOne({
                select: ['password'],
                where: {
                    username: payload.data.username
                }
            });
            const isVerified = user && payload.data.password === user.password;
            return isVerified ? payload.data : null;
        });
    }
    signin({ username, password }) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield this.userModel
                .createQueryBuilder('user')
                .where('user.username = :username', { username })
                .addSelect('user.password')
                .getOne();
            const extantAuthPwd = user && user.password;
            const extantPassword = extantAuthPwd || this.encodeMd5(app_config_1.AUTH.defaultPassword);
            const submittedPassword = this.encodeMd5(this.encodeBase64(password));
            if (submittedPassword !== extantPassword) {
                return Promise.reject('密码不匹配');
            }
            return this.createToken(user);
        });
    }
    getUserByUsername(username) {
        return this.userModel.findOne({ username });
    }
    getUsers(query) {
        return __awaiter(this, void 0, void 0, function* () {
            const [users, totalCount] = yield this.userModel.findAndCount({
                where: [
                    {
                        username: typeorm_1.Like(`%${query.query.name || ''}%`)
                    }
                ],
                skip: query.skip,
                take: query.take
            });
            return {
                totalCount,
                list: users
            };
        });
    }
    getRoles() {
        return this.roleModel.find();
    }
    addUser(user) {
        return __awaiter(this, void 0, void 0, function* () {
            user.password = this.encodeMd5(this.encodeBase64(user.password));
            const { id } = yield this.userModel.save(user);
            return this.userModel.findOne(id);
        });
    }
    deleteUser(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield this.userModel.findOne(userId);
            this.userModel.remove(user);
            return;
        });
    }
    updateUser(body, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            let user = yield this.userModel.findOne(userId);
            user = Object.assign({}, user, body);
            this.userModel.save(user);
            return;
        });
    }
};
UserService = __decorate([
    common_1.Injectable(),
    __param(0, typeorm_2.InjectRepository(user_model_1.UserModel)),
    __param(1, typeorm_2.InjectRepository(user_model_1.RoleModel)),
    __metadata("design:paramtypes", [typeorm_1.Repository,
        typeorm_1.Repository,
        jwt_1.JwtService])
], UserService);
exports.UserService = UserService;
//# sourceMappingURL=user.service.js.map