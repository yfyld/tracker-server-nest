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
class AddProjectDto {
}
__decorate([
    class_validator_1.IsDefined(),
    class_validator_1.IsNotEmpty({ message: '项目名称不能为空' }),
    __metadata("design:type", String)
], AddProjectDto.prototype, "name", void 0);
__decorate([
    class_validator_1.IsOptional(),
    class_validator_1.IsString({ message: '账号必须为字符串' }),
    __metadata("design:type", String)
], AddProjectDto.prototype, "description", void 0);
exports.AddProjectDto = AddProjectDto;
class AddProjectResDto {
}
exports.AddProjectResDto = AddProjectResDto;
class AddMembersDto {
}
__decorate([
    class_validator_1.IsNotEmpty({ message: '项目id不能为空' }),
    __metadata("design:type", Number)
], AddMembersDto.prototype, "projectId", void 0);
__decorate([
    class_validator_1.IsNotEmpty({ message: 'memberIds不能为空' }),
    __metadata("design:type", Array)
], AddMembersDto.prototype, "memberIds", void 0);
__decorate([
    class_validator_1.IsNotEmpty({ message: 'roleCode不能为空' }),
    __metadata("design:type", String)
], AddMembersDto.prototype, "roleCode", void 0);
exports.AddMembersDto = AddMembersDto;
class DeleteMembersDto {
}
__decorate([
    class_validator_1.IsNotEmpty({ message: '项目id不能为空' }),
    __metadata("design:type", Number)
], DeleteMembersDto.prototype, "projectId", void 0);
__decorate([
    class_validator_1.IsNotEmpty({ message: 'memberIds不能为空' }),
    __metadata("design:type", Array)
], DeleteMembersDto.prototype, "memberIds", void 0);
exports.DeleteMembersDto = DeleteMembersDto;
class UpdateMembersDto {
}
__decorate([
    class_validator_1.IsNotEmpty({ message: '项目id不能为空' }),
    __metadata("design:type", Number)
], UpdateMembersDto.prototype, "projectId", void 0);
__decorate([
    class_validator_1.IsNotEmpty({ message: 'memberIds不能为空' }),
    __metadata("design:type", Array)
], UpdateMembersDto.prototype, "memberIds", void 0);
__decorate([
    class_validator_1.IsNotEmpty({ message: 'roleCode不能为空' }),
    __metadata("design:type", String)
], UpdateMembersDto.prototype, "roleCode", void 0);
exports.UpdateMembersDto = UpdateMembersDto;
class QueryProjectsDto {
}
__decorate([
    class_validator_1.IsOptional(),
    class_validator_1.IsString({ message: 'projectName必须为字符串' }),
    __metadata("design:type", String)
], QueryProjectsDto.prototype, "projectName", void 0);
exports.QueryProjectsDto = QueryProjectsDto;
class ProjectDto {
}
exports.ProjectDto = ProjectDto;
class UpdateProjectDto {
}
__decorate([
    class_validator_1.IsNumber(),
    __metadata("design:type", Number)
], UpdateProjectDto.prototype, "id", void 0);
__decorate([
    class_validator_1.IsString({ message: '项目名必须为字符串' }),
    __metadata("design:type", String)
], UpdateProjectDto.prototype, "name", void 0);
__decorate([
    class_validator_1.IsOptional(),
    class_validator_1.IsString({ message: '描述必须为字符串' }),
    __metadata("design:type", String)
], UpdateProjectDto.prototype, "description", void 0);
exports.UpdateProjectDto = UpdateProjectDto;
class AddSourcemapsDto {
}
__decorate([
    class_validator_1.IsDefined(),
    class_validator_1.IsNotEmpty({ message: '项目id不能为空' }),
    __metadata("design:type", Number)
], AddSourcemapsDto.prototype, "projectId", void 0);
__decorate([
    class_validator_1.IsDefined(),
    __metadata("design:type", Array)
], AddSourcemapsDto.prototype, "files", void 0);
__decorate([
    class_validator_1.IsDefined(),
    __metadata("design:type", String)
], AddSourcemapsDto.prototype, "version", void 0);
__decorate([
    class_validator_1.IsDefined(),
    __metadata("design:type", Boolean)
], AddSourcemapsDto.prototype, "hash", void 0);
exports.AddSourcemapsDto = AddSourcemapsDto;
class ActionSourcemapsDto {
}
__decorate([
    class_validator_1.IsDefined(),
    class_validator_1.IsNotEmpty({ message: '项目id不能为空' }),
    __metadata("design:type", Number)
], ActionSourcemapsDto.prototype, "projectId", void 0);
__decorate([
    class_validator_1.IsDefined(),
    __metadata("design:type", Array)
], ActionSourcemapsDto.prototype, "sourcemapIds", void 0);
__decorate([
    class_validator_1.IsString({ message: 'actionType必须为字符串' }),
    __metadata("design:type", String)
], ActionSourcemapsDto.prototype, "actionType", void 0);
__decorate([
    class_validator_1.IsBoolean({ message: 'hash必须为布尔值' }),
    __metadata("design:type", Boolean)
], ActionSourcemapsDto.prototype, "hash", void 0);
__decorate([
    class_validator_1.IsString({ message: 'version必须为字符串' }),
    __metadata("design:type", String)
], ActionSourcemapsDto.prototype, "version", void 0);
exports.ActionSourcemapsDto = ActionSourcemapsDto;
//# sourceMappingURL=project.dto.js.map