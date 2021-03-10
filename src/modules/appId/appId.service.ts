import { PermissionModel } from '@/modules/permission/permission.model';
import { Injectable, Inject, forwardRef } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like, In, FindManyOptions } from 'typeorm';
import Utils from '@/utils/utils';
import { AppIdModel } from './appId.model';
import { AppIdInsertDto, AppIdListDto } from './appId.dto';
import { PageData, QueryListQuery } from '@/interfaces/request.interface';

@Injectable()
export class AppIdService {
  constructor(
    @InjectRepository(AppIdModel)
    private readonly appIdModel: Repository<AppIdModel>
  ) {}

  /**
   * 添加权限
   * @param currentUser: 当前登录用户
   * @param body: 权限对象
   * @return Promise<PermissionListItemDto>
   */
  public async insert(body: AppIdInsertDto): Promise<void> {
    await this.appIdModel
      .createQueryBuilder()
      .insert()
      .values(body)
      .execute();
    return;
  }

  /**
   * 添加权限
   * @param currentUser: 当前登录用户
   * @param body: 权限对象
   * @return Promise<PermissionListItemDto>
   */
  public async getList(query: QueryListQuery<AppIdListDto>): Promise<PageData<AppIdModel>> {
    const findParam: FindManyOptions<AppIdModel> = {
      skip: query.skip,
      take: query.take,
      where: {
        isDeleted: 0
      }
    };
    if (query.query.appId) {
      (findParam as any).where.appId = Like(`%${query.query.appId}%`);
    }
    if (query.query.appName) {
      (findParam as any).where.appName = Like(`%${query.query.appName}%`);
    }
    const [projects, totalCount] = await this.appIdModel.findAndCount(findParam);
    return {
      totalCount,
      list: projects
    };
  }
}
