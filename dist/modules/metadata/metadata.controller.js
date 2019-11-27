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
Object.defineProperty(exports, "__esModule", { value: true });
const parse_page_query_int_pipe_1 = require("../../pipes/parse-page-query-int.pipe");
const parse_int_pipe_1 = require("./../../pipes/parse-int.pipe");
const query_list_decorators_1 = require("../../decotators/query-list.decorators");
const common_1 = require("@nestjs/common");
const metadata_service_1 = require("./metadata.service");
const http_decotator_1 = require("@/decotators/http.decotator");
const auth_guard_1 = require("@/guards/auth.guard");
const swagger_1 = require("@nestjs/swagger");
const metadata_dto_1 = require("./metadata.dto");
let MetadataController = class MetadataController {
    constructor(metadataService) {
        this.metadataService = metadataService;
    }
    addMetadata(body) {
        return this.metadataService.addMetadata(body);
    }
    updateMetadata(body) {
        return this.metadataService.updateMetadata(body);
    }
    deleteMetadata(metadataId) {
        return this.metadataService.deleteMetadata(metadataId);
    }
    enableMetadata(metadataId) {
        return this.metadataService.enableMetadata(metadataId);
    }
    disableMetadata(metadataId) {
        return this.metadataService.disableMetadata(metadataId);
    }
    getMetadataList(query) {
        return this.metadataService.getMetadataList(query);
    }
    getFields(query) {
        return this.metadataService.getFields(query);
    }
    getActiveFields(query) {
        return this.metadataService.getActiveFields(query);
    }
    addMetadataTag(body) {
        return this.metadataService.addMetadataTag(body);
    }
    getMetadataTags(query) {
        return this.metadataService.getMetadataTags(query);
    }
};
__decorate([
    http_decotator_1.HttpProcessor.handle('新增元数据'),
    common_1.Post('/'),
    common_1.UseGuards(auth_guard_1.JwtAuthGuard),
    __param(0, common_1.Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [metadata_dto_1.AddMetadataDto]),
    __metadata("design:returntype", Promise)
], MetadataController.prototype, "addMetadata", null);
__decorate([
    http_decotator_1.HttpProcessor.handle('更新元数据'),
    common_1.Put('/'),
    common_1.UseGuards(auth_guard_1.JwtAuthGuard),
    __param(0, common_1.Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [metadata_dto_1.UpdateMetadataDto]),
    __metadata("design:returntype", Promise)
], MetadataController.prototype, "updateMetadata", null);
__decorate([
    http_decotator_1.HttpProcessor.handle('删除元数据'),
    common_1.Delete('/:metadataId'),
    common_1.UseGuards(auth_guard_1.JwtAuthGuard),
    __param(0, common_1.Param('metadataId', new parse_int_pipe_1.ParseIntPipe())),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], MetadataController.prototype, "deleteMetadata", null);
__decorate([
    http_decotator_1.HttpProcessor.handle('启用元数据'),
    common_1.Put('/enable/:metadataId'),
    common_1.UseGuards(auth_guard_1.JwtAuthGuard),
    __param(0, common_1.Param('metadataId', new parse_int_pipe_1.ParseIntPipe())),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], MetadataController.prototype, "enableMetadata", null);
__decorate([
    http_decotator_1.HttpProcessor.handle('停用元数据'),
    common_1.Put('/disable/:metadataId'),
    common_1.UseGuards(auth_guard_1.JwtAuthGuard),
    __param(0, common_1.Param('metadataId', new parse_int_pipe_1.ParseIntPipe())),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], MetadataController.prototype, "disableMetadata", null);
__decorate([
    http_decotator_1.HttpProcessor.handle('获取元数据列表'),
    common_1.Get('/'),
    __param(0, query_list_decorators_1.QueryList(new parse_page_query_int_pipe_1.ParsePageQueryIntPipe(['projectId', 'status']))),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], MetadataController.prototype, "getMetadataList", null);
__decorate([
    http_decotator_1.HttpProcessor.handle('获取元数据列表'),
    common_1.Get('/fields'),
    __param(0, query_list_decorators_1.QueryList(new parse_page_query_int_pipe_1.ParsePageQueryIntPipe(['projectId', 'status', 'type']))),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], MetadataController.prototype, "getFields", null);
__decorate([
    common_1.Get('/active-fields'),
    __param(0, common_1.Query()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], MetadataController.prototype, "getActiveFields", null);
__decorate([
    http_decotator_1.HttpProcessor.handle('新增标签'),
    common_1.Post('/tag'),
    common_1.UseGuards(auth_guard_1.JwtAuthGuard),
    __param(0, common_1.Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [metadata_dto_1.AddMetadataTagDto]),
    __metadata("design:returntype", Promise)
], MetadataController.prototype, "addMetadataTag", null);
__decorate([
    http_decotator_1.HttpProcessor.handle('获取tag列表'),
    common_1.UseGuards(auth_guard_1.JwtAuthGuard),
    common_1.Get('/tag'),
    __param(0, query_list_decorators_1.QueryList(new parse_page_query_int_pipe_1.ParsePageQueryIntPipe(['projectId']))),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], MetadataController.prototype, "getMetadataTags", null);
MetadataController = __decorate([
    swagger_1.ApiUseTags('元数据'),
    common_1.Controller('metadata'),
    __metadata("design:paramtypes", [metadata_service_1.MetadataService])
], MetadataController);
exports.MetadataController = MetadataController;
//# sourceMappingURL=metadata.controller.js.map