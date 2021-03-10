import { ModuleListReqDto, ModuleListItemDto, AddModuleDto } from './module.dto';

// import { MetadataModel, FieldModel, MetadataTagModel } from './module.model';
import { Injectable, HttpService } from '@nestjs/common';
import { Repository, In, LessThan, MoreThan, Between, Like, FindManyOptions, EntityManager } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

import { QueryListQuery, PageData } from '@/interfaces/request.interface';

import { ModuleModel } from './module.model';

@Injectable()
export class ModuleService {
  constructor(
    @InjectRepository(ModuleModel)
    private readonly moduleModel: Repository<ModuleModel>
  ) {}

  /**
   *获取module List
   *
   * @memberof ModuleService
   */

  public async getModuleList(
    // currentUser: UserModel,
    query: QueryListQuery<ModuleListReqDto>
  ): Promise<PageData<ModuleListItemDto>> {
    const [modules, totalCount] = await this.moduleModel.findAndCount({
      select: ['id', 'name', 'description', 'createdAt', 'updatedAt'],
      where: [
        {
          name: Like(`%${query.query.name || ''}%`)
          // isDeleted: 0
        }
      ],
      skip: query.skip,
      take: query.take
    });

    return {
      totalCount,
      list: modules
    };
  }

  /**
   * 根据模块名加描述
   * @param module: 模块名+描述
   * @return Promise<void>
   */
  public async addModule(module: AddModuleDto): Promise<void> {
    await this.moduleModel
      .createQueryBuilder()
      .insert()
      .values(module)
      .execute();
    return;
  }
}
