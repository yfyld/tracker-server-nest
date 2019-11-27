import { BoardModel } from './../board/board.model';
import { ProjectModel } from '../project/project.model';
import { UserModel } from '../user/user.model';
export declare class ReportModel {
    id: string;
    name: string;
    type: string;
    dateStart: number;
    dateEnd: number;
    dateType: string;
    model: string;
    data: string;
    description: string;
    project: ProjectModel;
    projectId: number;
    board: BoardModel;
    boardId: number;
    creator: UserModel;
    createdAt: Date;
    updatedAt: Date;
}
