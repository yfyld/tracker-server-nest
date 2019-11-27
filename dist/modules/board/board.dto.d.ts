import { ReportModel } from './../report/report.model';
import { BoardModel } from './board.model';
import { ProjectModel } from '../project/project.model';
export declare class BoardDto {
    name: string;
    id: string;
    project: ProjectModel | {
        id: number;
    };
}
export declare class QueryBoardListDto {
    projectId: number;
    isPublic: boolean;
    name: string;
    status: number;
    isShared: boolean;
}
export declare class QueryBoardInfoDto {
    projectId: number;
    id: number;
}
export declare class BoardInfoDto extends BoardModel {
    reportList: ReportModel[];
}
export declare class AddBoardDto {
    name: string;
    projectId: number;
    layout: {
        x: number;
        y: number;
        w: number;
        h: number;
        i: string;
    }[];
    reports: number[];
    type: string;
    status: number;
}
export declare class UpdateBoardDto {
    name: string;
    description?: string;
    id: string;
    projectId: number;
    layout: {
        x: number;
        y: number;
        w: number;
        h: number;
        i: string;
    }[];
    status: number;
}
export declare class AddBoardReportDto {
    name: string;
}
