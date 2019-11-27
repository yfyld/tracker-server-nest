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
const board_model_1 = require("./board.model");
const class_validator_1 = require("class-validator");
class BoardDto {
}
__decorate([
    class_validator_1.IsDefined(),
    class_validator_1.IsNotEmpty({ message: '项目名称不能为空' }),
    __metadata("design:type", String)
], BoardDto.prototype, "name", void 0);
exports.BoardDto = BoardDto;
class QueryBoardListDto {
}
__decorate([
    class_validator_1.IsOptional(),
    __metadata("design:type", Number)
], QueryBoardListDto.prototype, "projectId", void 0);
__decorate([
    class_validator_1.IsOptional(),
    __metadata("design:type", Boolean)
], QueryBoardListDto.prototype, "isPublic", void 0);
__decorate([
    class_validator_1.IsOptional(),
    __metadata("design:type", String)
], QueryBoardListDto.prototype, "name", void 0);
__decorate([
    class_validator_1.IsOptional(),
    __metadata("design:type", Number)
], QueryBoardListDto.prototype, "status", void 0);
__decorate([
    class_validator_1.IsOptional(),
    __metadata("design:type", Boolean)
], QueryBoardListDto.prototype, "isShared", void 0);
exports.QueryBoardListDto = QueryBoardListDto;
class QueryBoardInfoDto {
}
__decorate([
    class_validator_1.IsDefined(),
    __metadata("design:type", Number)
], QueryBoardInfoDto.prototype, "projectId", void 0);
__decorate([
    class_validator_1.IsDefined(),
    __metadata("design:type", Number)
], QueryBoardInfoDto.prototype, "id", void 0);
exports.QueryBoardInfoDto = QueryBoardInfoDto;
class BoardInfoDto extends board_model_1.BoardModel {
}
__decorate([
    class_validator_1.IsDefined(),
    __metadata("design:type", Array)
], BoardInfoDto.prototype, "reportList", void 0);
exports.BoardInfoDto = BoardInfoDto;
class AddBoardDto {
}
__decorate([
    class_validator_1.IsDefined(),
    class_validator_1.IsNotEmpty({ message: '看板名称不能为空' }),
    __metadata("design:type", String)
], AddBoardDto.prototype, "name", void 0);
__decorate([
    class_validator_1.IsDefined(),
    __metadata("design:type", Number)
], AddBoardDto.prototype, "projectId", void 0);
__decorate([
    class_validator_1.IsDefined(),
    __metadata("design:type", Array)
], AddBoardDto.prototype, "layout", void 0);
exports.AddBoardDto = AddBoardDto;
class UpdateBoardDto {
}
__decorate([
    class_validator_1.IsOptional(),
    __metadata("design:type", String)
], UpdateBoardDto.prototype, "name", void 0);
__decorate([
    class_validator_1.IsOptional(),
    __metadata("design:type", String)
], UpdateBoardDto.prototype, "description", void 0);
__decorate([
    class_validator_1.IsDefined(),
    __metadata("design:type", String)
], UpdateBoardDto.prototype, "id", void 0);
__decorate([
    class_validator_1.IsDefined(),
    __metadata("design:type", Number)
], UpdateBoardDto.prototype, "projectId", void 0);
__decorate([
    class_validator_1.IsOptional(),
    __metadata("design:type", Array)
], UpdateBoardDto.prototype, "layout", void 0);
exports.UpdateBoardDto = UpdateBoardDto;
class AddBoardReportDto {
}
__decorate([
    class_validator_1.IsOptional(),
    __metadata("design:type", String)
], AddBoardReportDto.prototype, "name", void 0);
exports.AddBoardReportDto = AddBoardReportDto;
//# sourceMappingURL=board.dto.js.map