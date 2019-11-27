import { RoleModel } from './../user/user.model';
import { UserModel } from '../user/user.model';
export declare class ProjectModel {
    id: number;
    name: string;
    description: string;
    creator: UserModel;
}
export declare class MemberModel {
    id: number;
    project: ProjectModel;
    user: UserModel;
    role: RoleModel;
}
export declare class SourcemapModel {
    id: number;
    url: string;
    version: string;
    hash: boolean;
    fileName: string;
    project: ProjectModel;
}
