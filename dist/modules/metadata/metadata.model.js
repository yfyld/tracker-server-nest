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
const typeorm_1 = require("typeorm");
const project_model_1 = require("../project/project.model");
let MetadataTagModel = class MetadataTagModel {
};
__decorate([
    typeorm_1.PrimaryGeneratedColumn(),
    __metadata("design:type", Number)
], MetadataTagModel.prototype, "id", void 0);
__decorate([
    typeorm_1.Column(),
    __metadata("design:type", String)
], MetadataTagModel.prototype, "name", void 0);
__decorate([
    typeorm_1.Column(),
    __metadata("design:type", String)
], MetadataTagModel.prototype, "description", void 0);
__decorate([
    typeorm_1.ManyToOne(type => project_model_1.ProjectModel),
    __metadata("design:type", project_model_1.ProjectModel)
], MetadataTagModel.prototype, "project", void 0);
MetadataTagModel = __decorate([
    typeorm_1.Entity()
], MetadataTagModel);
exports.MetadataTagModel = MetadataTagModel;
let FieldModel = class FieldModel {
};
__decorate([
    typeorm_1.PrimaryGeneratedColumn(),
    __metadata("design:type", Number)
], FieldModel.prototype, "id", void 0);
__decorate([
    typeorm_1.Column(),
    __metadata("design:type", String)
], FieldModel.prototype, "code", void 0);
__decorate([
    typeorm_1.Column(),
    __metadata("design:type", String)
], FieldModel.prototype, "type", void 0);
__decorate([
    typeorm_1.Column(),
    __metadata("design:type", Number)
], FieldModel.prototype, "status", void 0);
__decorate([
    typeorm_1.Column(),
    __metadata("design:type", String)
], FieldModel.prototype, "name", void 0);
FieldModel = __decorate([
    typeorm_1.Entity()
], FieldModel);
exports.FieldModel = FieldModel;
let MetadataModel = class MetadataModel {
};
__decorate([
    typeorm_1.PrimaryGeneratedColumn(),
    __metadata("design:type", Number)
], MetadataModel.prototype, "id", void 0);
__decorate([
    typeorm_1.Column(),
    __metadata("design:type", String)
], MetadataModel.prototype, "name", void 0);
__decorate([
    typeorm_1.Column(),
    __metadata("design:type", String)
], MetadataModel.prototype, "code", void 0);
__decorate([
    typeorm_1.Column(),
    __metadata("design:type", Number)
], MetadataModel.prototype, "type", void 0);
__decorate([
    typeorm_1.Column(),
    __metadata("design:type", Number)
], MetadataModel.prototype, "status", void 0);
__decorate([
    typeorm_1.Column(),
    __metadata("design:type", String)
], MetadataModel.prototype, "description", void 0);
__decorate([
    typeorm_1.ManyToOne(type => project_model_1.ProjectModel),
    __metadata("design:type", project_model_1.ProjectModel)
], MetadataModel.prototype, "project", void 0);
__decorate([
    typeorm_1.Column(),
    __metadata("design:type", Number)
], MetadataModel.prototype, "projectId", void 0);
__decorate([
    typeorm_1.CreateDateColumn(),
    __metadata("design:type", Date)
], MetadataModel.prototype, "createdAt", void 0);
__decorate([
    typeorm_1.UpdateDateColumn(),
    __metadata("design:type", Date)
], MetadataModel.prototype, "updatedAt", void 0);
__decorate([
    typeorm_1.ManyToMany(type => MetadataTagModel),
    typeorm_1.JoinTable(),
    __metadata("design:type", Array)
], MetadataModel.prototype, "tags", void 0);
MetadataModel = __decorate([
    typeorm_1.Entity()
], MetadataModel);
exports.MetadataModel = MetadataModel;
//# sourceMappingURL=metadata.model.js.map