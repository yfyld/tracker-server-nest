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
const typeorm_1 = require("typeorm");
const project_model_1 = require("../project/project.model");
const class_transformer_1 = require("class-transformer");
let PermissionModel = class PermissionModel {
};
__decorate([
    typeorm_1.PrimaryGeneratedColumn(),
    __metadata("design:type", Number)
], PermissionModel.prototype, "id", void 0);
__decorate([
    typeorm_1.Column({ length: 500 }),
    swagger_1.ApiModelProperty(),
    __metadata("design:type", String)
], PermissionModel.prototype, "name", void 0);
__decorate([
    typeorm_1.Column({ unique: true }),
    swagger_1.ApiModelProperty(),
    __metadata("design:type", String)
], PermissionModel.prototype, "code", void 0);
__decorate([
    typeorm_1.Column(),
    swagger_1.ApiModelProperty(),
    __metadata("design:type", Number)
], PermissionModel.prototype, "status", void 0);
PermissionModel = __decorate([
    typeorm_1.Entity()
], PermissionModel);
exports.PermissionModel = PermissionModel;
let RoleModel = class RoleModel {
};
__decorate([
    typeorm_1.PrimaryGeneratedColumn(),
    __metadata("design:type", Number)
], RoleModel.prototype, "id", void 0);
__decorate([
    typeorm_1.Column(),
    swagger_1.ApiModelProperty(),
    __metadata("design:type", String)
], RoleModel.prototype, "name", void 0);
__decorate([
    typeorm_1.Column(),
    swagger_1.ApiModelProperty(),
    __metadata("design:type", String)
], RoleModel.prototype, "code", void 0);
__decorate([
    typeorm_1.Column('int'),
    swagger_1.ApiModelProperty(),
    __metadata("design:type", Number)
], RoleModel.prototype, "status", void 0);
__decorate([
    typeorm_1.Column('int'),
    swagger_1.ApiModelProperty(),
    __metadata("design:type", Number)
], RoleModel.prototype, "global", void 0);
__decorate([
    typeorm_1.ManyToMany(type => PermissionModel),
    typeorm_1.JoinTable(),
    __metadata("design:type", Array)
], RoleModel.prototype, "permissions", void 0);
RoleModel = __decorate([
    typeorm_1.Entity()
], RoleModel);
exports.RoleModel = RoleModel;
let UserModel = class UserModel {
};
__decorate([
    typeorm_1.PrimaryGeneratedColumn(),
    __metadata("design:type", Number)
], UserModel.prototype, "id", void 0);
__decorate([
    typeorm_1.Column(),
    __metadata("design:type", String)
], UserModel.prototype, "username", void 0);
__decorate([
    typeorm_1.Column(),
    __metadata("design:type", String)
], UserModel.prototype, "nickname", void 0);
__decorate([
    typeorm_1.Column(),
    __metadata("design:type", String)
], UserModel.prototype, "email", void 0);
__decorate([
    typeorm_1.Column(),
    __metadata("design:type", String)
], UserModel.prototype, "mobile", void 0);
__decorate([
    class_transformer_1.Exclude(),
    typeorm_1.Column({ select: false }),
    __metadata("design:type", String)
], UserModel.prototype, "password", void 0);
__decorate([
    typeorm_1.ManyToMany(type => RoleModel),
    typeorm_1.JoinTable(),
    __metadata("design:type", Array)
], UserModel.prototype, "roles", void 0);
__decorate([
    typeorm_1.ManyToMany(type => PermissionModel),
    typeorm_1.JoinTable(),
    __metadata("design:type", Array)
], UserModel.prototype, "permissions", void 0);
UserModel = __decorate([
    typeorm_1.Entity()
], UserModel);
exports.UserModel = UserModel;
let TeamModel = class TeamModel {
};
__decorate([
    typeorm_1.PrimaryGeneratedColumn(),
    __metadata("design:type", Number)
], TeamModel.prototype, "id", void 0);
__decorate([
    swagger_1.ApiModelProperty(),
    class_validator_1.IsDefined(),
    class_validator_1.IsString(),
    typeorm_1.Column(),
    __metadata("design:type", String)
], TeamModel.prototype, "name", void 0);
__decorate([
    typeorm_1.ManyToMany(type => UserModel),
    typeorm_1.JoinTable(),
    __metadata("design:type", Array)
], TeamModel.prototype, "users", void 0);
TeamModel = __decorate([
    typeorm_1.Entity()
], TeamModel);
exports.TeamModel = TeamModel;
let ProjectRoleModel = class ProjectRoleModel {
};
__decorate([
    typeorm_1.PrimaryGeneratedColumn(),
    __metadata("design:type", Number)
], ProjectRoleModel.prototype, "id", void 0);
__decorate([
    typeorm_1.OneToOne(type => UserModel),
    typeorm_1.JoinColumn(),
    __metadata("design:type", UserModel)
], ProjectRoleModel.prototype, "user", void 0);
__decorate([
    typeorm_1.OneToOne(type => RoleModel),
    typeorm_1.JoinColumn(),
    __metadata("design:type", RoleModel)
], ProjectRoleModel.prototype, "role", void 0);
__decorate([
    typeorm_1.OneToOne(type => project_model_1.ProjectModel),
    typeorm_1.JoinColumn(),
    __metadata("design:type", project_model_1.ProjectModel)
], ProjectRoleModel.prototype, "project", void 0);
ProjectRoleModel = __decorate([
    typeorm_1.Entity()
], ProjectRoleModel);
exports.ProjectRoleModel = ProjectRoleModel;
//# sourceMappingURL=user.model.js.map