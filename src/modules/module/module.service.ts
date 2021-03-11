import {
  ModuleListReqDto,
  ModuleListItemDto,
  AddModuleDto,
  UpdateModuleDto,
  QueryModuleListDto,
  ModuleTypesItemDto
} from './module.dto';

// import { MetadataModel, FieldModel, MetadataTagModel } from './module.model';
import { Injectable, HttpService } from '@nestjs/common';
import { Repository, In, LessThan, MoreThan, Between, Like, FindManyOptions, EntityManager } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

import { QueryListQuery, PageData } from '@/interfaces/request.interface';

import { ModuleModel } from './module.model';
import { Readable } from 'typeorm/platform/PlatformTools';
import { FieldModel } from '../metadata/metadata.model';
import { XlsxService } from '@/providers/xlsx/xlsx.service';

@Injectable()
export class ModuleService {
  constructor(
    @InjectRepository(ModuleModel)
    private readonly moduleModel: Repository<ModuleModel>,

    private readonly xlsxervice: XlsxService
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
    console.log('queryquery', query);
    const [modules, totalCount] = await this.moduleModel.findAndCount({
      select: ['id', 'name', 'description', 'createdAt', 'updatedAt'],
      where: [
        {
          name: Like(`%${query.query.name || ''}%`),
          isDeleted: 0
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

  public async getModuleTypes(): Promise<ModuleTypesItemDto[]> {
    const [moduleTypes, totalCount] = await this.moduleModel.findAndCount({
      select: ['id', 'name'],
      where: [
        {
          isDeleted: 0
        }
      ]
    });

    return moduleTypes;
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

  /**
   * 删除模块
   * @param moduleId: 模块ID
   * @return Promise<void>
   */
  public async deleteModule(moduleId: number): Promise<void> {
    await this.moduleModel
      .createQueryBuilder()
      .delete()
      .from(ModuleModel)
      .where('id = :moduleId', { moduleId })
      .execute();
    return;
  }

  /**
   * 更新模块
   * @param module: 模块名+描述
   * @return Promise<void>
   */
  public async updateModule({ description, name, id }: UpdateModuleDto): Promise<void> {
    await this.moduleModel
      .createQueryBuilder()
      .update(ModuleModel)
      .set({ description, name })
      .where('id = :id', { id })
      .execute();
    return;
  }

  public async exportExcel(query: QueryListQuery<QueryModuleListDto>): Promise<[Readable, number]> {
    const [modules, totalCount] = await this.moduleModel.findAndCount({
      select: ['id', 'name', 'description', 'createdAt', 'updatedAt'],
      where: [
        {
          name: Like(`%${query.query.name || ''}%`),
          isDeleted: 0
        }
      ],
      skip: query.skip,
      take: query.take
    });

    let data = [['id', '模块名称', '描述', '创建时间', '更新时间']];
    console.log('exportExcel', modules);
    data = data.concat(
      modules.map(item => {
        return [
          item.id.toString(),
          item.name.toString(),
          item.description.toString(),
          item.createdAt.toString(),
          item.updatedAt.toString()
        ];
      })
    );
    console.log(typeof this.xlsxervice);

    const result = await this.xlsxervice.exportExcel(data);
    return result;
  }
}
