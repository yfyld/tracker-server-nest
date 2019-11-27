import { ProjectModel } from '../project/project.model';
export declare class AddReportDto {
    name: string;
    description?: string;
    boardId?: number;
    type: string;
    data: any;
    projectId: number;
}
export declare class ReportDto {
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
export declare class QueryReportListDto {
    projectId: string;
    tag: string;
    status: number;
    name: string;
    inBoard: number;
    boardId: number;
}
export declare class UpdateReportDto {
    guarderId?: number;
    level?: number;
    status?: number;
    reportIds: string[];
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
