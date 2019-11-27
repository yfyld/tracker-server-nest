import { UserModel } from '../user/user.model';
export declare class AddProjectDto {
    name: string;
    description?: string;
}
export declare class AddProjectResDto {
    id: number;
}
export declare class AddMembersDto {
    projectId: number;
    memberIds: number[];
    roleCode: string;
}
export declare class DeleteMembersDto {
    projectId: number;
    memberIds: number[];
}
export declare class UpdateMembersDto {
    projectId: number;
    memberIds: number[];
    roleCode: string;
}
export declare class QueryProjectsDto {
    projectName?: string;
}
export declare class ProjectDto {
    id: number;
    name: string;
    description: string;
    creator: UserModel;
    members: any[];
}
export declare class UpdateProjectDto {
    id: number;
    name: string;
    description: string;
}
export declare class AddSourcemapsDto {
    projectId: number;
    files: {
        url: string;
        fileName: string;
    }[];
    version: string;
    hash: boolean;
}
export declare class ActionSourcemapsDto {
    projectId: number;
    sourcemapIds: number[];
    actionType: string;
    hash: boolean;
    version: string;
}
