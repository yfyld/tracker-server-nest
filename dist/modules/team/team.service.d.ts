import { QueryTeamListDto, UpdateTeamDto, AddTeamDto } from './team.dto';
import { TeamModel } from './team.model';
import { Repository } from 'typeorm';
import { QueryListQuery, PageData } from '@/interfaces/request.interface';
import { UserModel } from '../user/user.model';
export declare class TeamService {
    private readonly teamModel;
    constructor(teamModel: Repository<TeamModel>);
    addTeam(body: AddTeamDto, user: UserModel): Promise<void>;
    getTeams(query: QueryListQuery<QueryTeamListDto>): Promise<PageData<TeamModel>>;
    updateTeam(body: UpdateTeamDto): Promise<void>;
    deleteTeam(id: number): Promise<void>;
}
