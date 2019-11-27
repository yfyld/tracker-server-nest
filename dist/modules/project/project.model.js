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
const user_model_1 = require("./../user/user.model");
const class_validator_1 = require("class-validator");
const swagger_1 = require("@nestjs/swagger");
const typeorm_1 = require("typeorm");
const user_model_2 = require("../user/user.model");
let ProjectModel = class ProjectModel {
};
__decorate([
    typeorm_1.PrimaryGeneratedColumn(),
    __metadata("design:type", Number)
], ProjectModel.prototype, "id", void 0);
__decorate([
    typeorm_1.Column(),
    __metadata("design:type", String)
], ProjectModel.prototype, "name", void 0);
__decorate([
    typeorm_1.Column(),
    __metadata("design:type", String)
], ProjectModel.prototype, "description", void 0);
__decorate([
    typeorm_1.ManyToOne(type => user_model_2.UserModel, { cascade: true, onDelete: 'CASCADE' }),
    __metadata("design:type", user_model_2.UserModel)
], ProjectModel.prototype, "creator", void 0);
ProjectModel = __decorate([
    typeorm_1.Entity()
], ProjectModel);
exports.ProjectModel = ProjectModel;
let MemberModel = class MemberModel {
};
__decorate([
    typeorm_1.PrimaryGeneratedColumn(),
    __metadata("design:type", Number)
], MemberModel.prototype, "id", void 0);
__decorate([
    typeorm_1.ManyToOne(type => ProjectModel, { cascade: true, onDelete: 'CASCADE' }),
    __metadata("design:type", ProjectModel)
], MemberModel.prototype, "project", void 0);
__decorate([
    typeorm_1.ManyToOne(type => user_model_2.UserModel, { cascade: true, onDelete: 'CASCADE' }),
    __metadata("design:type", user_model_2.UserModel)
], MemberModel.prototype, "user", void 0);
__decorate([
    typeorm_1.ManyToOne(type => user_model_1.RoleModel, { cascade: true, onDelete: 'CASCADE' }),
    __metadata("design:type", user_model_1.RoleModel)
], MemberModel.prototype, "role", void 0);
MemberModel = __decorate([
    typeorm_1.Entity()
], MemberModel);
exports.MemberModel = MemberModel;
let SourcemapModel = class SourcemapModel {
};
__decorate([
    typeorm_1.PrimaryGeneratedColumn(),
    __metadata("design:type", Number)
], SourcemapModel.prototype, "id", void 0);
__decorate([
    swagger_1.ApiModelProperty(),
    class_validator_1.IsDefined(),
    class_validator_1.IsString(),
    typeorm_1.Column(),
    __metadata("design:type", String)
], SourcemapModel.prototype, "url", void 0);
__decorate([
    typeorm_1.Column(),
    __metadata("design:type", String)
], SourcemapModel.prototype, "version", void 0);
__decorate([
    typeorm_1.Column(),
    __metadata("design:type", Boolean)
], SourcemapModel.prototype, "hash", void 0);
__decorate([
    typeorm_1.Column(),
    __metadata("design:type", String)
], SourcemapModel.prototype, "fileName", void 0);
__decorate([
    typeorm_1.ManyToOne(type => ProjectModel, { cascade: true, onDelete: 'CASCADE' }),
    __metadata("design:type", ProjectModel)
], SourcemapModel.prototype, "project", void 0);
SourcemapModel = __decorate([
    typeorm_1.Entity()
], SourcemapModel);
exports.SourcemapModel = SourcemapModel;
//# sourceMappingURL=project.model.js.map