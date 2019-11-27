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
class AddReportDto {
}
__decorate([
    class_validator_1.IsString(),
    __metadata("design:type", String)
], AddReportDto.prototype, "name", void 0);
__decorate([
    class_validator_1.IsOptional(),
    class_validator_1.IsString(),
    __metadata("design:type", String)
], AddReportDto.prototype, "description", void 0);
__decorate([
    class_validator_1.IsOptional(),
    __metadata("design:type", Number)
], AddReportDto.prototype, "boardId", void 0);
__decorate([
    class_validator_1.IsString(),
    __metadata("design:type", String)
], AddReportDto.prototype, "type", void 0);
__decorate([
    class_validator_1.IsDefined(),
    __metadata("design:type", Object)
], AddReportDto.prototype, "data", void 0);
__decorate([
    class_validator_1.IsNumber(),
    __metadata("design:type", Number)
], AddReportDto.prototype, "projectId", void 0);
exports.AddReportDto = AddReportDto;
class ReportDto {
}
__decorate([
    swagger_1.ApiModelProperty(),
    class_validator_1.IsDefined(),
    class_validator_1.IsNotEmpty({ message: '项目名称不能为空' }),
    __metadata("design:type", String)
], ReportDto.prototype, "name", void 0);
__decorate([
    swagger_1.ApiModelProperty(),
    __metadata("design:type", String)
], ReportDto.prototype, "id", void 0);
__decorate([
    swagger_1.ApiModelProperty(),
    __metadata("design:type", String)
], ReportDto.prototype, "type", void 0);
__decorate([
    swagger_1.ApiModelProperty(),
    __metadata("design:type", Number)
], ReportDto.prototype, "level", void 0);
__decorate([
    swagger_1.ApiModelProperty(),
    __metadata("design:type", Number)
], ReportDto.prototype, "status", void 0);
__decorate([
    swagger_1.ApiModelProperty(),
    __metadata("design:type", String)
], ReportDto.prototype, "message", void 0);
__decorate([
    swagger_1.ApiModelProperty(),
    __metadata("design:type", String)
], ReportDto.prototype, "url", void 0);
__decorate([
    swagger_1.ApiModelProperty(),
    __metadata("design:type", String)
], ReportDto.prototype, "version", void 0);
__decorate([
    swagger_1.ApiModelProperty(),
    __metadata("design:type", Object)
], ReportDto.prototype, "project", void 0);
exports.ReportDto = ReportDto;
class QueryReportListDto {
}
__decorate([
    swagger_1.ApiModelProperty(),
    class_validator_1.IsDefined(),
    class_validator_1.IsNotEmpty({ message: '项目名称不能为空' }),
    __metadata("design:type", String)
], QueryReportListDto.prototype, "projectId", void 0);
__decorate([
    class_validator_1.IsOptional(),
    class_validator_1.IsString(),
    __metadata("design:type", String)
], QueryReportListDto.prototype, "tag", void 0);
__decorate([
    class_validator_1.IsOptional(),
    class_validator_1.IsNumber(),
    __metadata("design:type", Number)
], QueryReportListDto.prototype, "status", void 0);
__decorate([
    class_validator_1.IsOptional(),
    class_validator_1.IsString(),
    __metadata("design:type", String)
], QueryReportListDto.prototype, "name", void 0);
__decorate([
    class_validator_1.IsOptional(),
    class_validator_1.IsNumber(),
    __metadata("design:type", Number)
], QueryReportListDto.prototype, "inBoard", void 0);
__decorate([
    class_validator_1.IsOptional(),
    class_validator_1.IsNumber(),
    __metadata("design:type", Number)
], QueryReportListDto.prototype, "boardId", void 0);
exports.QueryReportListDto = QueryReportListDto;
class UpdateReportDto {
}
__decorate([
    class_validator_1.IsDefined(),
    __metadata("design:type", Array)
], UpdateReportDto.prototype, "reportIds", void 0);
__decorate([
    class_validator_1.IsDefined(),
    __metadata("design:type", String)
], UpdateReportDto.prototype, "actionType", void 0);
exports.UpdateReportDto = UpdateReportDto;
class SourceCodeDto {
}
exports.SourceCodeDto = SourceCodeDto;
class QueryFieldListDto {
}
__decorate([
    class_validator_1.IsDefined(),
    __metadata("design:type", Number)
], QueryFieldListDto.prototype, "projectId", void 0);
exports.QueryFieldListDto = QueryFieldListDto;
//# sourceMappingURL=report.dto.js.map