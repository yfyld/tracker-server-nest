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
const team_service_1 = require("./team.service");
const http_decotator_1 = require("@/decotators/http.decotator");
const auth_guard_1 = require("@/guards/auth.guard");
const swagger_1 = require("@nestjs/swagger");
const team_dto_1 = require("./team.dto");
const user_decorators_1 = require("@/decotators/user.decorators");
let TeamController = class TeamController {
    constructor(teamService) {
        this.teamService = teamService;
    }
    addTeam(body, user) {
        return this.teamService.addTeam(body, user);
    }
    getTeams(query) {
        return this.teamService.getTeams(query);
    }
    updateTeam(teamId) {
        return this.teamService.deleteTeam(teamId);
    }
};
__decorate([
    http_decotator_1.HttpProcessor.handle('新增报告单'),
    common_1.Post('/'),
    common_1.UseGuards(auth_guard_1.JwtAuthGuard),
    __param(0, common_1.Body()), __param(1, user_decorators_1.Auth()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [team_dto_1.AddTeamDto, Object]),
    __metadata("design:returntype", Promise)
], TeamController.prototype, "addTeam", null);
__decorate([
    http_decotator_1.HttpProcessor.handle('获取报告单列表'),
    common_1.UseGuards(auth_guard_1.JwtAuthGuard),
    common_1.Get('/'),
    __param(0, query_list_decorators_1.QueryList(new parse_page_query_int_pipe_1.ParsePageQueryIntPipe(['projectId', 'status']))),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], TeamController.prototype, "getTeams", null);
__decorate([
    http_decotator_1.HttpProcessor.handle('删除报告单'),
    common_1.Delete('/:teamId'),
    common_1.UseGuards(auth_guard_1.JwtAuthGuard),
    __param(0, common_1.Param('teamId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], TeamController.prototype, "updateTeam", null);
TeamController = __decorate([
    swagger_1.ApiUseTags('报告单'),
    common_1.Controller('team'),
    __metadata("design:paramtypes", [team_service_1.TeamService])
], TeamController);
exports.TeamController = TeamController;
//# sourceMappingURL=team.controller.js.map