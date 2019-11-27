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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const user_model_1 = require("./../user/user.model");
const bad_request_error_1 = require("./../../errors/bad-request.error");
const project_model_1 = require("./project.model");
const common_1 = require("@nestjs/common");
const typeorm_1 = require("typeorm");
const typeorm_2 = require("@nestjs/typeorm");
const user_model_2 = require("@/modules/user/user.model");
let ProjectService = class ProjectService {
    constructor(projectModel, userModel, roleModel, memberModel, sourcemapModel) {
        this.projectModel = projectModel;
        this.userModel = userModel;
        this.roleModel = roleModel;
        this.memberModel = memberModel;
        this.sourcemapModel = sourcemapModel;
    }
    getProjectById(projectId) {
        return __awaiter(this, void 0, void 0, function* () {
            const project = yield this.projectModel.findOne({
                where: { id: projectId },
                relations: ['creator']
            });
            if (!project) {
                throw new bad_request_error_1.HttpBadRequestError('项目不存在');
            }
            return project;
        });
    }
    getProjectInfo(projectId) {
        return __awaiter(this, void 0, void 0, function* () {
            const project = yield this.projectModel.findOne({
                where: { id: projectId },
                relations: ['creator']
            });
            if (!project) {
                throw new bad_request_error_1.HttpBadRequestError('项目不存在');
            }
            const members = yield this.memberModel.find({
                where: { project: { id: projectId } },
                relations: ['user', 'role']
            });
            const result = Object.assign({}, project, { members: members.map(item => (Object.assign({}, item.user, { roleCode: item.role && item.role.code }))) });
            return result;
        });
    }
    getProjects(query) {
        return __awaiter(this, void 0, void 0, function* () {
            const [projects, totalCount] = yield this.projectModel.findAndCount({
                skip: query.skip,
                take: query.take,
                where: {
                    name: typeorm_1.Like(`%${query.query.projectName || ''}%`)
                },
                relations: ['creator']
            });
            return {
                totalCount,
                list: projects
            };
        });
    }
    getMyProjects(user) {
        return __awaiter(this, void 0, void 0, function* () {
            const projects = yield this.memberModel.find({
                where: { user },
                relations: ['project', 'role']
            });
            return {
                list: projects.map(item => ({
                    name: item.project.name,
                    id: item.project.id,
                    role: item.role.code
                }))
            };
        });
    }
    addProject(projectInfo, user) {
        return __awaiter(this, void 0, void 0, function* () {
            const project = this.projectModel.create(Object.assign({ creator: user }, projectInfo));
            const { id } = yield this.projectModel.save(project);
            yield this.addMembers({
                projectId: id,
                memberIds: [user.id],
                roleCode: 'ADMIN'
            });
            return { id };
        });
    }
    updateProject(projectInfo) {
        return __awaiter(this, void 0, void 0, function* () {
            let project = yield this.projectModel.findOne(projectInfo.id);
            project = Object.assign({}, project, projectInfo);
            yield this.projectModel.save(project);
            return;
        });
    }
    deleteProject(projectId) {
        return __awaiter(this, void 0, void 0, function* () {
            const project = yield this.projectModel.findOne(projectId);
            yield this.projectModel.remove(project);
            return;
        });
    }
    addMembers(body) {
        return __awaiter(this, void 0, void 0, function* () {
            const { memberIds, projectId, roleCode } = body;
            const role = yield this.roleModel.findOne({ code: roleCode });
            if (!role) {
                throw new bad_request_error_1.HttpBadRequestError('角色不存在');
            }
            const project = yield this.projectModel.findOne(projectId);
            if (!project) {
                throw new bad_request_error_1.HttpBadRequestError('项目不存在');
            }
            const members = yield this.userModel.find({
                id: typeorm_1.In(memberIds)
            });
            yield this.memberModel
                .createQueryBuilder()
                .insert()
                .values(members.map(user => ({ role, project, user })))
                .execute();
            return;
        });
    }
    deleteMember(body) {
        return __awaiter(this, void 0, void 0, function* () {
            const { projectId, memberIds } = body;
            yield this.memberModel
                .createQueryBuilder('member')
                .delete()
                .where('project = :projectId AND userId IN (:...memberIds) ', {
                projectId,
                memberIds
            })
                .execute();
            return;
        });
    }
    updateMember(body) {
        return __awaiter(this, void 0, void 0, function* () {
            const { projectId, memberIds, roleCode } = body;
            const role = yield this.roleModel.findOne({ code: roleCode });
            if (!role) {
                throw new bad_request_error_1.HttpBadRequestError('角色不存在');
            }
            yield this.memberModel
                .createQueryBuilder('member')
                .update()
                .set({ role })
                .where('projectId = :projectId AND userId IN (:...memberIds) ', {
                projectId,
                memberIds
            })
                .execute();
            return;
        });
    }
    addSourcemap(body) {
        return __awaiter(this, void 0, void 0, function* () {
            const { projectId, files, hash, version } = body;
            yield this.sourcemapModel
                .createQueryBuilder('source')
                .insert()
                .values(files.map(file => (Object.assign({ project: { id: projectId }, hash,
                version }, file))))
                .execute();
            return;
        });
    }
    updateSourcemap(body) {
        return __awaiter(this, void 0, void 0, function* () {
            const { projectId, sourcemapIds, hash, version } = body;
            yield this.sourcemapModel
                .createQueryBuilder('member')
                .update()
                .set({ hash, version })
                .where('projectId = :projectId AND id IN (:...sourcemapIds) ', {
                projectId,
                sourcemapIds
            })
                .execute();
            return;
        });
    }
    deleteSourcemap(body) {
        return __awaiter(this, void 0, void 0, function* () {
            const { projectId, sourcemapIds } = body;
            yield this.sourcemapModel
                .createQueryBuilder('member')
                .delete()
                .where('projectId = :projectId AND id IN (:...sourcemapIds) ', {
                projectId,
                sourcemapIds
            })
                .execute();
            return;
        });
    }
};
ProjectService = __decorate([
    common_1.Injectable(),
    __param(0, typeorm_2.InjectRepository(project_model_1.ProjectModel)),
    __param(1, typeorm_2.InjectRepository(user_model_2.UserModel)),
    __param(2, typeorm_2.InjectRepository(user_model_1.RoleModel)),
    __param(3, typeorm_2.InjectRepository(project_model_1.MemberModel)),
    __param(4, typeorm_2.InjectRepository(project_model_1.SourcemapModel)),
    __metadata("design:paramtypes", [typeorm_1.Repository,
        typeorm_1.Repository,
        typeorm_1.Repository,
        typeorm_1.Repository,
        typeorm_1.Repository])
], ProjectService);
exports.ProjectService = ProjectService;
//# sourceMappingURL=project.service.js.map