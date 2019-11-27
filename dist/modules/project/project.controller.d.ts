import { QueryListQuery } from '@/interfaces/request.interface';
import { PageData } from './../../interfaces/request.interface';
import { ProjectModel } from './project.model';
import { ProjectService } from './project.service';
import { ProjectDto, AddProjectDto, AddMembersDto, DeleteMembersDto, UpdateMembersDto, QueryProjectsDto, UpdateProjectDto, AddProjectResDto } from './project.dto';
import { UserModel } from '@/modules/user/user.model';
export declare class ProjectController {
    private readonly projectService;
    constructor(projectService: ProjectService);
    addProject(body: AddProjectDto, user: UserModel): Promise<AddProjectResDto>;
    updateProject(body: UpdateProjectDto): Promise<void>;
    deleteProject(projectId: number): Promise<void>;
    getProjectInfo(projectId: number): Promise<ProjectDto>;
    getProjects(query: QueryListQuery<QueryProjectsDto>): Promise<PageData<ProjectModel>>;
    getMyProjects(user: UserModel): Promise<PageData<ProjectModel>>;
    addMembers(body: AddMembersDto): Promise<void>;
    deleteMember(body: DeleteMembersDto): Promise<void>;
    updateMember(body: UpdateMembersDto): Promise<void>;
}
