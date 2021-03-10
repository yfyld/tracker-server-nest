import { BaseUserDto } from './../user/user.dto';
import { UserModel } from './../user/user.model';
import { ProjectModel } from './../project/project.model';
import { ListData } from './../../interfaces/request.interface';
import { IEventAttr } from './module.interface';
import { EVENT_ATTRS } from './../../constants/event.constant';
import { ModuleListReqDto, ModuleListItemDto, AddModuleDto } from './module.dto';

// import { MetadataModel, FieldModel, MetadataTagModel } from './module.model';
import { Injectable, HttpService } from '@nestjs/common';
import { Repository, In, LessThan, MoreThan, Between, Like, FindManyOptions, EntityManager } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

import { QueryListQuery, PageData } from '@/interfaces/request.interface';

import { HttpBadRequestError } from '@/errors/bad-request.error';
import { SlsService } from '@/providers/sls/sls.service';
import { RedisService } from 'nestjs-redis';
import { XlsxService } from '@/providers/xlsx/xlsx.service';

import * as path from 'path';

import { Readable } from 'typeorm/platform/PlatformTools';
import { ModuleModel } from './module.model';
import { ModuleModule } from './module.module';

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
   * @param user: 用户名+密码传输对象
   * @return Promise<BaseUserDto>
   */
  public async addModule(module: AddModuleDto): Promise<void> {
    console.log('addModule', module);
    // const hasModule = await this.moduleModel.findOne({
    //   where: {
    //     name: module.name
    //   }
    // });
    // if (hasModule) {
    //   throw '该模块已存在';
    // }

    // const moduleObj = this.moduleModel.create({
    //   ...module
    // });
    return;
    // const moduleObj =  new ModuleModule()
    // moduleObj.name = modle
    //   await this.moduleModel.save(moduleObj);
    //   return;
  }
}
