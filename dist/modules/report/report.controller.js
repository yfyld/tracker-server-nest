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
const query_list_decorators_1 = require("../../decotators/query-list.decorators");
const common_1 = require("@nestjs/common");
const report_service_1 = require("./report.service");
const http_decotator_1 = require("@/decotators/http.decotator");
const auth_guard_1 = require("@/guards/auth.guard");
const swagger_1 = require("@nestjs/swagger");
const report_dto_1 = require("./report.dto");
const user_decorators_1 = require("@/decotators/user.decorators");
let ReportController = class ReportController {
    constructor(reportService) {
        this.reportService = reportService;
    }
    addReport(body, user) {
        return this.reportService.addReport(body, user);
    }
    getReports(query) {
        return this.reportService.getReports(query);
    }
    updateReport(reportId) {
        return this.reportService.deleteReport(reportId);
    }
};
__decorate([
    http_decotator_1.HttpProcessor.handle('新增报告单'),
    common_1.Post('/'),
    common_1.UseGuards(auth_guard_1.JwtAuthGuard),
    __param(0, common_1.Body()), __param(1, user_decorators_1.Auth()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [report_dto_1.AddReportDto, Object]),
    __metadata("design:returntype", Promise)
], ReportController.prototype, "addReport", null);
__decorate([
    http_decotator_1.HttpProcessor.handle('获取报告单列表'),
    common_1.UseGuards(auth_guard_1.JwtAuthGuard),
    common_1.Get('/'),
    __param(0, query_list_decorators_1.QueryList(new parse_page_query_int_pipe_1.ParsePageQueryIntPipe(['projectId', 'status', 'boardId', 'inBoard']))),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], ReportController.prototype, "getReports", null);
__decorate([
    http_decotator_1.HttpProcessor.handle('删除报告单'),
    common_1.Delete('/:reportId'),
    common_1.UseGuards(auth_guard_1.JwtAuthGuard),
    __param(0, common_1.Param('reportId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], ReportController.prototype, "updateReport", null);
ReportController = __decorate([
    swagger_1.ApiUseTags('报告单'),
    common_1.Controller('report'),
    __metadata("design:paramtypes", [report_service_1.ReportService])
], ReportController);
exports.ReportController = ReportController;
//# sourceMappingURL=report.controller.js.map