import { TeamModel } from './../team/team.model';
import { HttpBadRequestError } from './../../errors/bad-request.error';
import { ProjectModel, MemberModel } from './project.model';
import { Injectable } from '@nestjs/common';
import {
  Repository,
  In,
  Like,
  DeepPartial,
  Transaction,
  TransactionManager,
  EntityManager,
  FindManyOptions
} from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import {
  AddProjectDto,
  ProjectDto,
  UpdateMembersDto,
  QueryProjectsDto,
  UpdateProjectDto,
  AddProjectResDto,
  AddMembersDto,
  DeleteMembersDto,
  AddSourcemapsDto,
  ActionSourcemapsDto
} from './project.dto';
import { UserModel } from '@/modules/user/user.model';
import { QueryListQuery, PageData } from '@/interfaces/request.interface';
import { UseInterceptors, ClassSerializerInterceptor } from '@nestjs/common';
import { RoleModel } from '../role/role.model';

@Injectable()
export class ProjectService {
  constructor(
    @InjectRepository(ProjectModel)
    private readonly projectModel: Repository<ProjectModel>,
    @InjectRepository(UserModel)
    private readonly userModel: Repository<UserModel>,
    @InjectRepository(RoleModel)
    private readonly roleModel: Repository<RoleModel>,
    @InjectRepository(MemberModel)
    private readonly memberModel: Repository<MemberModel>,
    @InjectRepository(TeamModel)
    private readonly teamModel: Repository<TeamModel>
  ) {}

  public async getProjectById(projectId: number): Promise<ProjectModel> {
    const project = await this.projectModel.findOne({
      where: { id: projectId },
      relations: ['creator']
    });
    if (!project) {
      throw new HttpBadRequestError('项目不存在');
    }
    return project;
  }

  public async getProjectInfo(projectId: number): Promise<ProjectDto> {
    const project = await this.projectModel.findOne({
      where: { id: projectId },
      relations: ['creator']
    });
    if (!project) {
      throw new HttpBadRequestError('项目不存在');
    }
    const members = await this.memberModel.find({
      where: { project: { id: projectId } },
      relations: ['user', 'role']
    });

    const result: ProjectDto = {
      ...project,
      members: members.map(item => ({
        ...item.user,
        roleCode: item.role && item.role.code
      }))
    };
    return result;
  }

  public async getProjects(query: QueryListQuery<QueryProjectsDto>): Promise<PageData<ProjectModel>> {
    const findParam: FindManyOptions<ProjectModel> = {
      skip: query.skip,
      take: query.take,
      where: {
        isDeleted: 0,
        status: 1
      },
      relations: ['creator']
    };

    if (query.query.projectName) {
      (findParam as any).where.name = Like(`%${query.query.projectName}%`);
    }
    if (query.query.teamId) {
      (findParam as any).where.team = { id: Number(query.query.teamId) };
    }

    const [projects, totalCount] = await this.projectModel.findAndCount(findParam);
    return {
      totalCount,
      list: projects
    };
  }

  public async getMyProjects(user: UserModel): Promise<any> {
    const projects = await this.memberModel.find({
      where: { user, status: 1 },
      relations: ['project', 'role']
    });
    return {
      list: projects.map(item => ({
        name: item.project.name,
        id: item.project.id,
        role: item.role.code
      }))
    };
  }

  public async addProject(projectInfo: AddProjectDto, user: UserModel): Promise<AddProjectResDto> {
    const createParam: DeepPartial<ProjectModel> = {
      creator: user,
      ...projectInfo
    };
    const adminer = [user.id];
    if (projectInfo.teamId) {
      var team = await this.teamModel.findOne({
        where: { id: projectInfo.teamId },
        relations: ['creator', 'members']
      });
      if (!team) {
        throw '团队不存在';
      }
      createParam.team = team;
      adminer.push(team.creator.id);
    }
    const project = this.projectModel.create(createParam);
    const { id } = await this.projectModel.save(project);

    await this.addMembers({
      projectId: id,
      memberIds: adminer,
      roleCode: 'PROJECT_ADMIN'
    });

    if (team) {
      await this.addMembers({
        projectId: id,
        memberIds: team.members.filter(item => item.id !== user.id).map(item => item.id),
        roleCode: 'PROJECT_MEMBER'
      });
    }

    return { id };
  }

  public async updateProject(projectInfo: UpdateProjectDto): Promise<void> {
    let project = await this.projectModel.findOne(projectInfo.id);
    project = { ...project, ...projectInfo };
    await this.projectModel.save(project);
    return;
  }

  public async deleteProject(projectId: number): Promise<void> {
    const project = await this.projectModel.findOne(projectId);
    project.isDeleted = true;
    await this.projectModel.save(project);
    return;
  }

  public async addMembers(body: AddMembersDto): Promise<void> {
    const { memberIds, projectId, roleCode } = body;
    const role = await this.roleModel.findOne({ code: roleCode });
    if (!role) {
      throw new HttpBadRequestError('角色不存在');
    }
    const project = await this.projectModel.findOne(projectId);
    if (!project) {
      throw new HttpBadRequestError('项目不存在');
    }
    const members = await this.userModel.find({
      id: In(memberIds)
    });
    await this.memberModel
      .createQueryBuilder()
      .insert()
      .values(members.map(user => ({ role, project, user })))
      .execute();
    return;
  }

  public async deleteMember(body: DeleteMembersDto): Promise<void> {
    const { projectId, memberIds } = body;

    await this.memberModel
      .createQueryBuilder('member')
      .delete()
      .where('project = :projectId AND userId IN (:...memberIds) ', {
        projectId,
        memberIds
      })
      .execute();
    return;
  }

  public async updateMember(body: UpdateMembersDto): Promise<void> {
    const { projectId, memberIds, roleCode } = body;
    const role = await this.roleModel.findOne({ code: roleCode });
    if (!role) {
      throw new HttpBadRequestError('角色不存在');
    }
    await this.memberModel
      .createQueryBuilder('member')
      .update()
      .set({ role })
      .where('projectId = :projectId AND userId IN (:...memberIds) ', {
        projectId,
        memberIds
      })
      .execute();
    return;
  }
}
