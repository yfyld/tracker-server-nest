import { ProjectModel } from '../project/project.model';
export declare class AddTeamDto {
    name: string;
    description?: string;
    type: string;
    data: any;
    projectId: number;
}
export declare class TeamDto {
    name: string;
    id: string;
    type: string;
    level: number;
    status: number;
    message: string;
    url: string;
    version?: string;
    project: ProjectModel | {
        id: number;
    };
}
export declare class QueryTeamListDto {
    projectId: string;
    tag: string;
    status: number;
    name: string;
}
export declare class UpdateTeamDto {
    guarderId?: number;
    level?: number;
    status?: number;
    teamIds: string[];
    actionType: string;
}
export declare class SourceCodeDto {
    code: string;
    line: number;
    column: number;
    sourceUrl: string;
    name: string;
}
export declare class QueryFieldListDto {
    projectId: number;
    type: number;
    status: number;
    name?: string;
}
