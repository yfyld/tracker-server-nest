import { QueryTeamListDto, TeamDto, SourceCodeDto, UpdateTeamDto, AddTeamDto, QueryFieldListDto } from './team.dto';

import { TeamModel } from './team.model';
import { Injectable, HttpService } from '@nestjs/common';
import { Repository, In, LessThan, MoreThan, Between, Like, FindManyOptions } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

import { QueryListQuery, PageData } from '@/interfaces/request.interface';

import { HttpBadRequestError } from '@/errors/bad-request.error';
import { UserModel } from '../user/user.model';
@Injectable()
export class TeamService {
  constructor(
    @InjectRepository(TeamModel)
    private readonly teamModel: Repository<TeamModel>
  ) {}

  public async addTeam(body: AddTeamDto, user: UserModel): Promise<void> {
    const team = this.teamModel.create({
      ...body,
      creator: user,
      data: JSON.stringify(body.data)
    });
    await this.teamModel.save(team);
    return;
  }

  public async getTeams(query: QueryListQuery<QueryTeamListDto>): Promise<PageData<TeamModel>> {
    const searchBody: FindManyOptions<TeamModel> = {
      skip: query.skip,
      take: query.take,
      where: {},
      order: {}
    };

    if (query.sort.key) {
      searchBody.order[query.sort.key] = query.sort.value;
    }

    if (typeof query.query.status !== 'undefined') {
      (searchBody.where as any).status = query.query.status;
    }

    if (typeof query.query.name !== 'undefined') {
      (searchBody.where as any).name = Like(`%${query.query.name || ''}%`);
    }

    const [team, totalCount] = await this.teamModel.findAndCount(searchBody);
    return {
      totalCount,
      list: team
    };
  }

  public async updateTeam(body: UpdateTeamDto): Promise<void> {
    const updateBody: any = {};
    if (body.actionType === 'LEVEL') {
      updateBody.level = body.level;
    } else if (body.actionType === 'STATUS') {
      updateBody.status = body.status;
    } else {
      updateBody.guarder = { id: body.guarderId };
    }
    await this.teamModel
      .createQueryBuilder()
      .update()
      .set(updateBody)
      .where('id IN (:...teamIds)', { teamIds: body.teamIds })
      .execute();
    return;
  }

  public async deleteTeam(id: number): Promise<void> {
    const team = await this.teamModel.findOne(id);
    await this.teamModel.remove(team);
    return;
  }
}
