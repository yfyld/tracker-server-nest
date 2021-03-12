import {
  ModuleListReqDto,
  ModuleListItemDto,
  AddModuleDto,
  UpdateModuleDto,
  QueryModuleListDto,
  ModuleTypesItemDto
} from './module.dto';

// import { MetadataModel, FieldModel, MetadataTagModel } from './module.model';
import { Injectable } from '@nestjs/common';
import { Repository, Like } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

import { QueryListQuery, PageData } from '@/interfaces/request.interface';

import { ModuleModel } from './module.model';
import { Readable } from 'typeorm/platform/PlatformTools';
import { XlsxService } from '@/providers/xlsx/xlsx.service';
import { HttpBadRequestError } from '@/errors/bad-request.error';
import * as moment from 'moment';

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

  public async getModuleList(query: QueryListQuery<ModuleListReqDto>): Promise<PageData<ModuleListItemDto>> {
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

  public async getModuleTypes() {
    const [moduleTypes, totalCount] = await this.moduleModel.findAndCount({
      select: ['id', 'name'],
      where: [
        {
          isDeleted: 0
        }
      ]
    });

    return moduleTypes.map(v => ({
      label: v.name,
      value: String(v.id)
    }));
  }

  /**
   * 根据模块名加描述
   * @param module: 模块名+描述
   * @return Promise<void>
   */
  public async addModule(module: AddModuleDto): Promise<void> {
    const existedModule = await this.moduleModel.findOne({
      name: module.name,
      isDeleted: 0
    });

    if (!existedModule) {
      await this.moduleModel
        .createQueryBuilder()
        .insert()
        .values(module)
        .execute();
      return;
    } else {
      throw new HttpBadRequestError(`模块名${module.name}已存在`);
    }
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
  public async updateModule(body: UpdateModuleDto): Promise<void> {
    const { description, name, id } = body;

    const existedModule = await this.moduleModel.findOne({
      id,
      isDeleted: 0
    });

    if (existedModule) {
      console.log('updateModule1', body);

      await this.moduleModel
        .createQueryBuilder()
        .update(ModuleModel)
        .set(body)
        .where('id = :id', { id })
        .execute();
      return;
    }
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
    data = data.concat(
      modules.map(item => {
        return [
          item.id.toString(),
          item.name.toString(),
          item.description.toString(),
          moment(item.createdAt).format('L'),
          moment(item.updatedAt).format('L')
        ];
      })
    );

    const result = await this.xlsxervice.exportExcel(data);
    return result;
  }
}
