import { ReportModel } from './../report/report.model';
import { UserModel } from '../user/user.model';
import { ProjectModel } from '../project/project.model';
export declare class BoardModel {
    id: string;
    name: string;
    type: string;
    layout: string;
    status: number;
    creator: UserModel;
    project: ProjectModel;
    projectId: number;
    isPublic: boolean;
    createdAt: Date;
    updatedAt: Date;
}
export declare class BoardReportModel {
    id: string;
    board: BoardModel;
    report: ReportModel;
    dateType: string;
    dateStart: number;
    dateEnd: number;
    showType: string;
    timeType: string;
    subtitle: string;
}
