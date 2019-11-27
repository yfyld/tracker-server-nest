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
const report_model_1 = require("./../report/report.model");
const typeorm_1 = require("typeorm");
const user_model_1 = require("../user/user.model");
const project_model_1 = require("../project/project.model");
let BoardModel = class BoardModel {
};
__decorate([
    typeorm_1.PrimaryGeneratedColumn(),
    __metadata("design:type", String)
], BoardModel.prototype, "id", void 0);
__decorate([
    typeorm_1.Column(),
    __metadata("design:type", String)
], BoardModel.prototype, "name", void 0);
__decorate([
    typeorm_1.Column(),
    __metadata("design:type", String)
], BoardModel.prototype, "type", void 0);
__decorate([
    typeorm_1.Column(),
    __metadata("design:type", String)
], BoardModel.prototype, "layout", void 0);
__decorate([
    typeorm_1.Column(),
    __metadata("design:type", Number)
], BoardModel.prototype, "status", void 0);
__decorate([
    typeorm_1.ManyToOne(type => user_model_1.UserModel, { cascade: true, onDelete: 'CASCADE' }),
    __metadata("design:type", user_model_1.UserModel)
], BoardModel.prototype, "creator", void 0);
__decorate([
    typeorm_1.ManyToOne(type => project_model_1.ProjectModel),
    __metadata("design:type", project_model_1.ProjectModel)
], BoardModel.prototype, "project", void 0);
__decorate([
    typeorm_1.Column(),
    __metadata("design:type", Number)
], BoardModel.prototype, "projectId", void 0);
__decorate([
    typeorm_1.Column(),
    __metadata("design:type", Boolean)
], BoardModel.prototype, "isPublic", void 0);
__decorate([
    typeorm_1.CreateDateColumn(),
    __metadata("design:type", Date)
], BoardModel.prototype, "createdAt", void 0);
__decorate([
    typeorm_1.UpdateDateColumn(),
    __metadata("design:type", Date)
], BoardModel.prototype, "updatedAt", void 0);
BoardModel = __decorate([
    typeorm_1.Entity()
], BoardModel);
exports.BoardModel = BoardModel;
let BoardReportModel = class BoardReportModel {
};
__decorate([
    typeorm_1.PrimaryGeneratedColumn(),
    __metadata("design:type", String)
], BoardReportModel.prototype, "id", void 0);
__decorate([
    typeorm_1.OneToOne(type => BoardModel),
    typeorm_1.JoinColumn(),
    __metadata("design:type", BoardModel)
], BoardReportModel.prototype, "board", void 0);
__decorate([
    typeorm_1.OneToOne(type => report_model_1.ReportModel),
    typeorm_1.JoinColumn(),
    __metadata("design:type", report_model_1.ReportModel)
], BoardReportModel.prototype, "report", void 0);
__decorate([
    typeorm_1.Column(),
    __metadata("design:type", String)
], BoardReportModel.prototype, "dateType", void 0);
__decorate([
    typeorm_1.Column(),
    __metadata("design:type", Number)
], BoardReportModel.prototype, "dateStart", void 0);
__decorate([
    typeorm_1.Column(),
    __metadata("design:type", Number)
], BoardReportModel.prototype, "dateEnd", void 0);
__decorate([
    typeorm_1.Column(),
    __metadata("design:type", String)
], BoardReportModel.prototype, "showType", void 0);
__decorate([
    typeorm_1.Column(),
    __metadata("design:type", String)
], BoardReportModel.prototype, "timeType", void 0);
__decorate([
    typeorm_1.Column(),
    __metadata("design:type", String)
], BoardReportModel.prototype, "subtitle", void 0);
BoardReportModel = __decorate([
    typeorm_1.Entity()
], BoardReportModel);
exports.BoardReportModel = BoardReportModel;
//# sourceMappingURL=board.model.js.map