import { ProjectModel } from '../project/project.model';
export declare class PermissionModel {
    id: number;
    name: string;
    code: string;
    status: number;
}
export declare class RoleModel {
    id: number;
    name: string;
    code: string;
    status: number;
    global: number;
    permissions: PermissionModel[];
}
export declare class UserModel {
    id: number;
    username: string;
    nickname: string;
    email: string;
    mobile: string;
    password: string;
    roles: RoleModel[];
    permissions: PermissionModel[];
}
export declare class TeamModel {
    id: number;
    name: string;
    users: UserModel[];
}
export declare class ProjectRoleModel {
    id: number;
    user: UserModel;
    role: RoleModel;
    project: ProjectModel;
}
