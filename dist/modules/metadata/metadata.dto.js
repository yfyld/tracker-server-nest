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
class AddMetadataDto {
}
__decorate([
    class_validator_1.IsString(),
    __metadata("design:type", String)
], AddMetadataDto.prototype, "code", void 0);
__decorate([
    class_validator_1.IsString(),
    __metadata("design:type", String)
], AddMetadataDto.prototype, "name", void 0);
__decorate([
    class_validator_1.IsNumber(),
    __metadata("design:type", Number)
], AddMetadataDto.prototype, "type", void 0);
__decorate([
    class_validator_1.IsOptional(),
    class_validator_1.IsString(),
    __metadata("design:type", String)
], AddMetadataDto.prototype, "description", void 0);
__decorate([
    class_validator_1.IsNumber(),
    __metadata("design:type", Number)
], AddMetadataDto.prototype, "status", void 0);
__decorate([
    class_validator_1.IsNumber(),
    __metadata("design:type", Number)
], AddMetadataDto.prototype, "projectId", void 0);
exports.AddMetadataDto = AddMetadataDto;
class UpdateMetadataDto {
}
__decorate([
    class_validator_1.IsNumber(),
    __metadata("design:type", Number)
], UpdateMetadataDto.prototype, "id", void 0);
__decorate([
    class_validator_1.IsString(),
    __metadata("design:type", String)
], UpdateMetadataDto.prototype, "code", void 0);
__decorate([
    class_validator_1.IsString(),
    __metadata("design:type", String)
], UpdateMetadataDto.prototype, "name", void 0);
__decorate([
    class_validator_1.IsNumber(),
    __metadata("design:type", Number)
], UpdateMetadataDto.prototype, "type", void 0);
__decorate([
    class_validator_1.IsOptional(),
    class_validator_1.IsString(),
    __metadata("design:type", String)
], UpdateMetadataDto.prototype, "description", void 0);
__decorate([
    class_validator_1.IsNumber(),
    __metadata("design:type", Number)
], UpdateMetadataDto.prototype, "status", void 0);
__decorate([
    class_validator_1.IsNumber(),
    __metadata("design:type", Number)
], UpdateMetadataDto.prototype, "projectId", void 0);
exports.UpdateMetadataDto = UpdateMetadataDto;
class MetadataDto {
}
__decorate([
    swagger_1.ApiModelProperty(),
    class_validator_1.IsDefined(),
    class_validator_1.IsNotEmpty({ message: '项目名称不能为空' }),
    __metadata("design:type", String)
], MetadataDto.prototype, "name", void 0);
__decorate([
    swagger_1.ApiModelProperty(),
    __metadata("design:type", String)
], MetadataDto.prototype, "id", void 0);
__decorate([
    swagger_1.ApiModelProperty(),
    __metadata("design:type", String)
], MetadataDto.prototype, "type", void 0);
__decorate([
    swagger_1.ApiModelProperty(),
    __metadata("design:type", Number)
], MetadataDto.prototype, "level", void 0);
__decorate([
    swagger_1.ApiModelProperty(),
    __metadata("design:type", Number)
], MetadataDto.prototype, "status", void 0);
__decorate([
    swagger_1.ApiModelProperty(),
    __metadata("design:type", String)
], MetadataDto.prototype, "message", void 0);
__decorate([
    swagger_1.ApiModelProperty(),
    __metadata("design:type", String)
], MetadataDto.prototype, "url", void 0);
__decorate([
    swagger_1.ApiModelProperty(),
    __metadata("design:type", String)
], MetadataDto.prototype, "version", void 0);
__decorate([
    swagger_1.ApiModelProperty(),
    __metadata("design:type", Object)
], MetadataDto.prototype, "project", void 0);
exports.MetadataDto = MetadataDto;
class QueryMetadataListDto {
}
__decorate([
    swagger_1.ApiModelProperty(),
    class_validator_1.IsDefined(),
    class_validator_1.IsNotEmpty({ message: '项目名称不能为空' }),
    __metadata("design:type", String)
], QueryMetadataListDto.prototype, "projectId", void 0);
__decorate([
    class_validator_1.IsOptional(),
    class_validator_1.IsNumber(),
    __metadata("design:type", Number)
], QueryMetadataListDto.prototype, "status", void 0);
__decorate([
    class_validator_1.IsOptional(),
    class_validator_1.IsString(),
    __metadata("design:type", String)
], QueryMetadataListDto.prototype, "name", void 0);
exports.QueryMetadataListDto = QueryMetadataListDto;
class AddMetadataTagDto {
}
__decorate([
    class_validator_1.IsString(),
    __metadata("design:type", String)
], AddMetadataTagDto.prototype, "name", void 0);
__decorate([
    class_validator_1.IsOptional(),
    class_validator_1.IsString(),
    __metadata("design:type", String)
], AddMetadataTagDto.prototype, "description", void 0);
__decorate([
    class_validator_1.IsNumber(),
    __metadata("design:type", Number)
], AddMetadataTagDto.prototype, "projectId", void 0);
exports.AddMetadataTagDto = AddMetadataTagDto;
class QueryMetadataTagListDto {
}
__decorate([
    class_validator_1.IsNumber(),
    __metadata("design:type", Number)
], QueryMetadataTagListDto.prototype, "projectId", void 0);
exports.QueryMetadataTagListDto = QueryMetadataTagListDto;
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
//# sourceMappingURL=metadata.dto.js.map