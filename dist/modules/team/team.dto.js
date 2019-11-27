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
class AddTeamDto {
}
__decorate([
    class_validator_1.IsString(),
    __metadata("design:type", String)
], AddTeamDto.prototype, "name", void 0);
__decorate([
    class_validator_1.IsOptional(),
    class_validator_1.IsString(),
    __metadata("design:type", String)
], AddTeamDto.prototype, "description", void 0);
__decorate([
    class_validator_1.IsString(),
    __metadata("design:type", String)
], AddTeamDto.prototype, "type", void 0);
__decorate([
    class_validator_1.IsDefined(),
    __metadata("design:type", Object)
], AddTeamDto.prototype, "data", void 0);
__decorate([
    class_validator_1.IsNumber(),
    __metadata("design:type", Number)
], AddTeamDto.prototype, "projectId", void 0);
exports.AddTeamDto = AddTeamDto;
class TeamDto {
}
__decorate([
    swagger_1.ApiModelProperty(),
    class_validator_1.IsDefined(),
    class_validator_1.IsNotEmpty({ message: '项目名称不能为空' }),
    __metadata("design:type", String)
], TeamDto.prototype, "name", void 0);
__decorate([
    swagger_1.ApiModelProperty(),
    __metadata("design:type", String)
], TeamDto.prototype, "id", void 0);
__decorate([
    swagger_1.ApiModelProperty(),
    __metadata("design:type", String)
], TeamDto.prototype, "type", void 0);
__decorate([
    swagger_1.ApiModelProperty(),
    __metadata("design:type", Number)
], TeamDto.prototype, "level", void 0);
__decorate([
    swagger_1.ApiModelProperty(),
    __metadata("design:type", Number)
], TeamDto.prototype, "status", void 0);
__decorate([
    swagger_1.ApiModelProperty(),
    __metadata("design:type", String)
], TeamDto.prototype, "message", void 0);
__decorate([
    swagger_1.ApiModelProperty(),
    __metadata("design:type", String)
], TeamDto.prototype, "url", void 0);
__decorate([
    swagger_1.ApiModelProperty(),
    __metadata("design:type", String)
], TeamDto.prototype, "version", void 0);
__decorate([
    swagger_1.ApiModelProperty(),
    __metadata("design:type", Object)
], TeamDto.prototype, "project", void 0);
exports.TeamDto = TeamDto;
class QueryTeamListDto {
}
__decorate([
    swagger_1.ApiModelProperty(),
    class_validator_1.IsDefined(),
    class_validator_1.IsNotEmpty({ message: '项目名称不能为空' }),
    __metadata("design:type", String)
], QueryTeamListDto.prototype, "projectId", void 0);
__decorate([
    class_validator_1.IsOptional(),
    class_validator_1.IsString(),
    __metadata("design:type", String)
], QueryTeamListDto.prototype, "tag", void 0);
__decorate([
    class_validator_1.IsOptional(),
    class_validator_1.IsNumber(),
    __metadata("design:type", Number)
], QueryTeamListDto.prototype, "status", void 0);
__decorate([
    class_validator_1.IsOptional(),
    class_validator_1.IsString(),
    __metadata("design:type", String)
], QueryTeamListDto.prototype, "name", void 0);
exports.QueryTeamListDto = QueryTeamListDto;
class UpdateTeamDto {
}
__decorate([
    class_validator_1.IsDefined(),
    __metadata("design:type", Array)
], UpdateTeamDto.prototype, "teamIds", void 0);
__decorate([
    class_validator_1.IsDefined(),
    __metadata("design:type", String)
], UpdateTeamDto.prototype, "actionType", void 0);
exports.UpdateTeamDto = UpdateTeamDto;
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
//# sourceMappingURL=team.dto.js.map