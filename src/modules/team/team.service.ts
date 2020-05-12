import { ParsePageQueryIntPipe } from './../../pipes/parse-page-query-int.pipe';
import { QueryTeamListDto, TeamDto, UpdateTeamDto, AddTeamDto } from './team.dto';

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
    private readonly teamModel: Repository<TeamModel>,
    @InjectRepository(UserModel)
    private readonly userModel: Repository<UserModel>
  ) {}

  public async addTeam(body: AddTeamDto, user: UserModel): Promise<void> {
    const members = body.members
      ? await this.userModel.find({
          id: In(body.members)
        })
      : [];
    const team = this.teamModel.create({
      ...body,
      members,
      admin: user,
      creator: user
    });
    await this.teamModel.save(team);
    return;
  }

  public async getTeams(query: QueryListQuery<QueryTeamListDto>, user: UserModel): Promise<PageData<TeamModel>> {
    const searchBody: FindManyOptions<TeamModel> = {
      skip: query.skip,
      take: query.take,
      where: {},
      relations: ['creator', 'members'],
      order: {}
    };

    if (typeof query.query.name !== 'undefined') {
      (searchBody.where as any).name = Like(`%${query.query.name || ''}%`);
    }

    if (!!query.query.relevance) {
      (searchBody.where as any).creator = user;
    }

    const [team, totalCount] = await this.teamModel.findAndCount(searchBody);
    return {
      totalCount,
      list: team
    };
  }

  public async updateTeam(body: UpdateTeamDto): Promise<void> {
    const members = body.members.length
      ? await this.userModel.find({
          id: In(body.members)
        })
      : [];
    const creator = await this.userModel.findOne(body.creatorId);
    let team = await this.teamModel.findOne(body.id);
    team = { ...team, ...body, members, creator };
    await this.teamModel.save(team);
    return;
  }

  public async deleteTeam(id: number): Promise<void> {
    const team = await this.teamModel.findOne(id);
    await this.teamModel.remove(team);
    return;
  }

  public async getTeamById(id: number): Promise<TeamModel> {
    return await this.teamModel.findOne({ relations: ['creator', 'members'], where: { id } });
  }
}
