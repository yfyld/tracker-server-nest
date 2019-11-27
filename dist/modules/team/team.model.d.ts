import { UserModel } from '../user/user.model';
export declare class TeamModel {
    id: string;
    name: string;
    description: string;
    members: UserModel[];
    creator: UserModel;
}
