import { QueryListQuery } from '@/interfaces/request.interface';
import { PageData } from '../../interfaces/request.interface';
import { TeamModel } from './team.model';
import { TeamService } from './team.service';
import { QueryTeamListDto, AddTeamDto } from './team.dto';
export declare class TeamController {
    private readonly teamService;
    constructor(teamService: TeamService);
    addTeam(body: AddTeamDto, user: any): Promise<void>;
    getTeams(query: QueryListQuery<QueryTeamListDto>): Promise<PageData<TeamModel>>;
    updateTeam(teamId: number): Promise<void>;
}
