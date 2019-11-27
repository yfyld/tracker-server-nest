import { RoleModel } from './../user/user.model';
import { ProjectModel, MemberModel, SourcemapModel } from './project.model';
import { Repository } from 'typeorm';
import { AddProjectDto, ProjectDto, UpdateMembersDto, QueryProjectsDto, UpdateProjectDto, AddProjectResDto, AddMembersDto, DeleteMembersDto, AddSourcemapsDto, ActionSourcemapsDto } from './project.dto';
import { UserModel } from '@/modules/user/user.model';
import { QueryListQuery, PageData } from '@/interfaces/request.interface';
export declare class ProjectService {
    private readonly projectModel;
    private readonly userModel;
    private readonly roleModel;
    private readonly memberModel;
    private readonly sourcemapModel;
    constructor(projectModel: Repository<ProjectModel>, userModel: Repository<UserModel>, roleModel: Repository<RoleModel>, memberModel: Repository<MemberModel>, sourcemapModel: Repository<SourcemapModel>);
    getProjectById(projectId: number): Promise<ProjectModel>;
    getProjectInfo(projectId: number): Promise<ProjectDto>;
    getProjects(query: QueryListQuery<QueryProjectsDto>): Promise<PageData<ProjectModel>>;
    getMyProjects(user: UserModel): Promise<any>;
    addProject(projectInfo: AddProjectDto, user: UserModel): Promise<AddProjectResDto>;
    updateProject(projectInfo: UpdateProjectDto): Promise<void>;
    deleteProject(projectId: number): Promise<void>;
    addMembers(body: AddMembersDto): Promise<void>;
    deleteMember(body: DeleteMembersDto): Promise<void>;
    updateMember(body: UpdateMembersDto): Promise<void>;
    addSourcemap(body: AddSourcemapsDto): Promise<void>;
    updateSourcemap(body: ActionSourcemapsDto): Promise<void>;
    deleteSourcemap(body: ActionSourcemapsDto): Promise<void>;
}
