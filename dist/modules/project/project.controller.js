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
const parse_int_pipe_1 = require("./../../pipes/parse-int.pipe");
const query_list_decorators_1 = require("./../../decotators/query-list.decorators");
const common_1 = require("@nestjs/common");
const project_model_1 = require("./project.model");
const project_service_1 = require("./project.service");
const http_decotator_1 = require("@/decotators/http.decotator");
const auth_guard_1 = require("@/guards/auth.guard");
const swagger_1 = require("@nestjs/swagger");
const project_dto_1 = require("./project.dto");
const user_decorators_1 = require("@/decotators/user.decorators");
const user_model_1 = require("@/modules/user/user.model");
let ProjectController = class ProjectController {
    constructor(projectService) {
        this.projectService = projectService;
    }
    addProject(body, user) {
        return this.projectService.addProject(body, user);
    }
    updateProject(body) {
        return this.projectService.updateProject(body);
    }
    deleteProject(projectId) {
        return this.projectService.deleteProject(projectId);
    }
    getProjectInfo(projectId) {
        return this.projectService.getProjectInfo(projectId);
    }
    getProjects(query) {
        return this.projectService.getProjects(query);
    }
    getMyProjects(user) {
        return this.projectService.getMyProjects(user);
    }
    addMembers(body) {
        return this.projectService.addMembers(body);
    }
    deleteMember(body) {
        return this.projectService.deleteMember(body);
    }
    updateMember(body) {
        return this.projectService.updateMember(body);
    }
};
__decorate([
    swagger_1.ApiOperation({ title: '新建项目', description: '' }),
    swagger_1.ApiResponse({ status: 200, type: project_dto_1.ProjectDto }),
    common_1.Post('/'),
    http_decotator_1.HttpProcessor.handle({ message: '新建项目' }),
    common_1.UseGuards(auth_guard_1.JwtAuthGuard),
    __param(0, common_1.Body()), __param(1, user_decorators_1.Auth()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [project_dto_1.AddProjectDto, user_model_1.UserModel]),
    __metadata("design:returntype", Promise)
], ProjectController.prototype, "addProject", null);
__decorate([
    swagger_1.ApiOperation({ title: '编辑项目', description: '' }),
    http_decotator_1.HttpProcessor.handle('编辑项目'),
    common_1.Put('/'),
    common_1.UseGuards(auth_guard_1.JwtAuthGuard),
    __param(0, common_1.Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [project_dto_1.UpdateProjectDto]),
    __metadata("design:returntype", Promise)
], ProjectController.prototype, "updateProject", null);
__decorate([
    swagger_1.ApiOperation({ title: '删除项目', description: '' }),
    http_decotator_1.HttpProcessor.handle('删除项目'),
    common_1.Delete('/:projectId'),
    common_1.UseGuards(auth_guard_1.JwtAuthGuard),
    __param(0, common_1.Param('projectId', new parse_int_pipe_1.ParseIntPipe())),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], ProjectController.prototype, "deleteProject", null);
__decorate([
    common_1.UseInterceptors(common_1.ClassSerializerInterceptor),
    swagger_1.ApiOperation({ title: '获取项目信息', description: '' }),
    swagger_1.ApiBearerAuth(),
    swagger_1.ApiResponse({ status: 200, type: project_model_1.ProjectModel }),
    http_decotator_1.HttpProcessor.handle('获取项目信息'),
    common_1.Get('/info'),
    common_1.UseGuards(auth_guard_1.JwtAuthGuard),
    __param(0, common_1.Query('projectId', new parse_int_pipe_1.ParseIntPipe())),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], ProjectController.prototype, "getProjectInfo", null);
__decorate([
    swagger_1.ApiOperation({ title: '获取项目列表', description: '' }),
    swagger_1.ApiBearerAuth(),
    http_decotator_1.HttpProcessor.handle('获取项目列表'),
    common_1.UseGuards(auth_guard_1.JwtAuthGuard),
    common_1.Get('/'),
    __param(0, query_list_decorators_1.QueryList()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], ProjectController.prototype, "getProjects", null);
__decorate([
    swagger_1.ApiOperation({ title: '获取所有相关项目', description: '' }),
    swagger_1.ApiBearerAuth(),
    http_decotator_1.HttpProcessor.handle('获取所有相关项目'),
    common_1.UseGuards(auth_guard_1.JwtAuthGuard),
    common_1.Get('/all'),
    __param(0, user_decorators_1.Auth()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [user_model_1.UserModel]),
    __metadata("design:returntype", Promise)
], ProjectController.prototype, "getMyProjects", null);
__decorate([
    swagger_1.ApiOperation({ title: '添加成员', description: '' }),
    common_1.Post('/add-members'),
    http_decotator_1.HttpProcessor.handle({ message: '添加成员' }),
    common_1.UseGuards(auth_guard_1.JwtAuthGuard),
    __param(0, common_1.Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [project_dto_1.AddMembersDto]),
    __metadata("design:returntype", Promise)
], ProjectController.prototype, "addMembers", null);
__decorate([
    swagger_1.ApiOperation({ title: '删除成员', description: '' }),
    common_1.Post('/delete-members'),
    http_decotator_1.HttpProcessor.handle({ message: '删除成员' }),
    common_1.UseGuards(auth_guard_1.JwtAuthGuard),
    __param(0, common_1.Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [project_dto_1.DeleteMembersDto]),
    __metadata("design:returntype", Promise)
], ProjectController.prototype, "deleteMember", null);
__decorate([
    swagger_1.ApiOperation({ title: '编辑成员', description: '' }),
    common_1.Post('/update-members'),
    http_decotator_1.HttpProcessor.handle({ message: '编辑成员' }),
    __param(0, common_1.Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [project_dto_1.UpdateMembersDto]),
    __metadata("design:returntype", Promise)
], ProjectController.prototype, "updateMember", null);
ProjectController = __decorate([
    swagger_1.ApiUseTags('项目相关'),
    common_1.Controller('project'),
    common_1.UseGuards(auth_guard_1.JwtAuthGuard),
    __metadata("design:paramtypes", [project_service_1.ProjectService])
], ProjectController);
exports.ProjectController = ProjectController;
//# sourceMappingURL=project.controller.js.map