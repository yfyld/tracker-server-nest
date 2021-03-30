import { BaseUserDto } from './../user/user.dto';
import { UserModel } from './../user/user.model';
import { ProjectModel } from './../project/project.model';
import { ListData } from './../../interfaces/request.interface';
import { IEventAttr } from './metadata.interface';
import { EVENT_ATTRS } from './../../constants/event.constant';
import {
  QueryMetadataListDto,
  AddMetadataDto,
  UpdateMetadataDto,
  QueryFieldListDto,
  AddMetadataTagDto,
  QueryMetadataTagListDto,
  EventAttrsListDto,
  UpdateMetadataTagDto,
  GetEventAttrDto,
  UpdateMetadataBatchDto,
  UpdateMetadataLogDto
} from './metadata.dto';

import { MetadataModel, FieldModel, MetadataTagModel } from './metadata.model';
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

import { ModuleService } from '../module/module.service';
import Utils from '@/utils/utils';
import { ModuleModel } from '../module/module.model';

@Injectable()
export class MetadataService {
  constructor(
    @InjectRepository(MetadataModel)
    private readonly metadataModel: Repository<MetadataModel>,

    @InjectRepository(MetadataTagModel)
    private readonly metadataTagModel: Repository<MetadataTagModel>,

    @InjectRepository(ProjectModel)
    private readonly projectModel: Repository<ProjectModel>,

    @InjectRepository(ModuleModel)
    private readonly moduleModel: Repository<ModuleModel>,

    private readonly httpService: HttpService,
    private readonly slsService: SlsService,
    private readonly redisService: RedisService,
    private readonly xlsxervice: XlsxService
  ) {}

  /**
   *根据code查询metadata
   *
   * @param {string} code
   * @param {number} projectId
   * @returns {Promise<MetadataModel>}
   * @memberof MetadataService
   */
  public async getMetadataByCode(code: string, projectId: number): Promise<MetadataModel> {
    let metadata = await this.metadataModel.findOne({ code, projectId });
    return metadata;
  }

  private getActionTypeName(type: string) {
    switch (type) {
      case '页面':
        return 1;

      case '页面曝光':
        return 1;
      case '事件':
        return 0;

      case '区域曝光':
        return 2;

      case '点击':
        return 0;

      default:
        break;
    }
  }

  private async metadataListParam(query: QueryListQuery<QueryMetadataListDto>) {
    let {
      skip,
      take,
      sort: { key: sortKey, value: sortValue },
      query: { projectId, status, type, name, code, tags, log, operatorType, pageTypes, modules }
    } = query;

    // 排序
    let orderBy: {
      [propName: string]: any;
    } = {};
    if (sortKey && sortValue) {
      orderBy[`metadata.${sortKey}`] = sortValue;
    }
    orderBy = Object.assign(orderBy, {
      'metadata.createdAt': 'DESC'
    });

    // 查询条件
    let condition: string = 'isDeleted = false';
    let params: {
      [propName: string]: any;
    } = {};

    if (query.query.isAssociation) {
      const projectInfo = await this.projectModel.findOne({
        where: {
          id: projectId
        },
        relations: ['associationProjects']
      });
      const associationProjectIds = projectInfo.associationProjects.map(item => item.id);
      let projectIds = query.query.projectIds
        ? query.query.projectIds
            .split(',')
            .map(item => Number(item))
            .filter(item => associationProjectIds.includes(item))
        : null;
      if (!projectIds || !projectIds.length) {
        projectIds = associationProjectIds;
        projectIds.push(projectId);
      }

      params.projectIds = projectIds;
      condition += ' and metadata.projectId in (:projectIds)';
    } else {
      condition += ' and metadata.projectId = :projectId';
    }

    params.projectId = projectId;

    if (name) {
      condition += ` and metadata.name LIKE :name`;
      params.name = `%${name}%`;
    }

    if (code) {
      condition += ` and metadata.code LIKE :code `;
      params.code = `%${code}%`;
    }

    if (typeof status !== 'undefined') {
      condition += ' and metadata.status = :status';
      params.status = status;
    }

    if (type) {
      condition += ' and metadata.type = :type';
      params.type = type;
    }

    if (operatorType) {
      condition += ' and metadata.operatorType = :operatorType';
      params.operatorType = operatorType;
    }

    if (tags) {
      condition += ' and tag.id in (:tags)';
      params.tags = tags.split(',');
    }

    if (pageTypes) {
      condition += ' and metadata.pageType in (:pageTypes)';
      params.pageTypes = pageTypes.split(',');
    }

    if (modules) {
      condition += ' and metadata.moduleId in (:modules)';
      params.modules = modules.split(',');
    }

    if (log) {
      switch (log) {
        case 'NONE':
          condition += ` and metadata.log = 0 `;
          break;
        case 'NONE_H5':
          condition += ` and metadata.log = metadata.logByApp `;
          break;
        case 'NONE_NATIVE':
          condition += ` and metadata.logByApp = 0 `;
          break;
        case 'H5':
          condition += ` and metadata.log > 0 and metadata.log > metadata.logByApp `;
          break;
        case 'NATIVE':
          condition += ` and metadata.log > 0 and metadata.logByApp > 0 `;
          break;
        case 'ALL':
          condition += ` and metadata.log > 0 `;
          break;
        default:
          break;
      }
    }

    return {
      condition,
      params,
      skip,
      take,
      orderBy
    };
  }

  /**
   *获取metadata List
   *
   * @memberof MetadataService
   */
  public async getMetadataList(
    query: QueryListQuery<QueryMetadataListDto>,
    user: UserModel
  ): Promise<PageData<MetadataModel>> {
    const { condition, params, skip, take, orderBy } = await this.metadataListParam(query);

    let modules = await this.moduleModel.find();
    let moduleByIdMap = modules.reduce((total, item) => {
      total[item.id] = item.name;
      return total;
    }, {});

    let [metadata, totalCount] = await this.metadataModel
      .createQueryBuilder('metadata')
      .leftJoinAndSelect('metadata.tags', 'tag')
      .where(condition, params)
      .skip(skip)
      .take(take)
      .orderBy(orderBy)
      .getManyAndCount();

    metadata = metadata.map(item => {
      (item as any).module = moduleByIdMap[item.moduleId] || null;

      //是否显示日志数
      if (!(user as any).permissions.includes('METADATA_SHOW_LOG')) {
        if (item.log) {
          (item as any).log = '**' + item.log.toString().substr(-2, 2);
        }
        if (item.logByApp) {
          (item as any).logByApp = '**' + item.logByApp.toString().substr(-2, 2);
        }
        if (item.logByH5) {
          (item as any).logByH5 = '**' + item.logByH5.toString().substr(-2, 2);
        }
        if (item.recentLog) {
          (item as any).recentLog = '**' + item.recentLog.toString().substr(-2, 2);
        }
        if (item.recentLogByApp) {
          (item as any).recentLogByApp = '**' + item.recentLogByApp.toString().substr(-2, 2);
        }
        if (item.recentLogByH5) {
          (item as any).recentLogByH5 = '**' + item.recentLogByH5.toString().substr(-2, 2);
        }
      }
      return item;
    });

    return {
      totalCount,
      list: metadata
    };
  }

  public async exportExcel(query: QueryListQuery<QueryMetadataListDto>): Promise<[Readable, number]> {
    const { condition, params, orderBy } = await this.metadataListParam(query);

    let [metadata, totalCount] = await this.metadataModel
      .createQueryBuilder('metadata')
      .leftJoinAndSelect('metadata.tags', 'tag')
      .where(condition, params)
      // .skip(skip)
      // .take(take)
      .orderBy(orderBy)
      .getManyAndCount();

    // const modules = await this.modelService.getModuleByIds(metadata.map(md => md.module));

    // const moduleMap = Utils.arrToMap(modules, ['id']);
    // const newMetadata = metadata.map(md => {
    //   return { ...md, module: moduleMap.get(md.module.toString()).name };
    // });

    const pageTypes = await this.httpService
      .get<{ label: string; value: string }[]>('https://static.91jkys.com/dms/defa6d786f0531ab6fedb525705b53de.json')
      .toPromise();

    let data = [['名称', 'code', '类型', '启用', '标签', '模块', '页面类型', '备注']];
    data = data.concat(
      metadata.map(item => {
        return [
          item.name,
          item.code,
          item.type === 1 ? '页面' : '事件',
          item.status === 1 ? '是' : '否',
          item.tags.map(tag => tag.name).join(','),
          item.moduleId.toString(),
          pageTypes.data.find(i => i.value === item.pageType).label,
          item.description
        ];
      })
    );

    const result = await this.xlsxervice.exportExcel(data);
    return result;
  }

  public async isMetaDataAssocited(moduleId: number) {
    const metadata = await this.metadataModel
      .createQueryBuilder('metadata')
      .where('moduleId = :moduleId', { moduleId })
      .getOne();
    return metadata;
  }

  /**
   *添加metadata
   *
   * @param {AddMetadataDto} body
   * @returns {Promise<void>}
   * @memberof MetadataService
   */
  public async addMetadata(body: AddMetadataDto): Promise<void> {
    const { code, projectId, tags, newTags } = body;
    const oldMetadata = await this.metadataModel.findOne({
      code: code,
      projectId,
      isDeleted: false
    });
    if (oldMetadata && !oldMetadata.isDeleted) {
      throw new HttpBadRequestError(`元数据${code}重复`);
    }

    // 获取已有的标签
    let metadataTags = [];
    if (tags && tags.length) {
      metadataTags = await this.metadataTagModel.findByIds(tags);
    }
    // 处理新增的标签
    if (newTags && newTags.length) {
      const newMetadataTagModels = [];
      for (let item of newTags) {
        const oldTag = await this.metadataTagModel.findOne({ name: item });
        if (oldTag) {
          metadataTags.push(oldTag);
          continue;
        }
        newMetadataTagModels.push(this.metadataTagModel.create({ name: item, project: { id: projectId }, projectId }));
      }
      const newMetadataTags = await this.metadataTagModel.save(newMetadataTagModels);
      metadataTags.push(...newMetadataTags);
    }

    if (oldMetadata) {
      oldMetadata.isDeleted = false;
      oldMetadata.name = body.name;
      oldMetadata.type = body.type;
      oldMetadata.status = body.status;
      oldMetadata.tags.push(...metadataTags);
      await this.metadataModel.save(oldMetadata);
      return;
    }

    let metadata = this.metadataModel.create({
      ...body,
      tags: []
    });

    metadata.tags.push(...metadataTags);
    await this.metadataModel.save(metadata);
    return;
  }

  private async getHttpBuffer(url: string): Promise<Buffer> {
    const request = require('request');
    const res = await request.get(url);
    const response = [];
    return new Promise((resolve, reject) => {
      res.on('data', function(chunk) {
        response.push(chunk);
      });

      res.on('end', function() {
        resolve(Buffer.concat(response));
      });
    });
  }

  public async addMetadataByExcel(projectId: number, url: string, manager: EntityManager): Promise<void> {
    const res = await this.getHttpBuffer(url);
    const datas = await this.xlsxervice.parseByBuffer(
      res,
      ['名称', 'code', '类型', '启用', '标签', '模块', '页面类型', '备注'],
      ['name', 'code', 'type', 'status', 'newTags', 'moduleName', 'pageTypeName', 'description']
    );

    const metadatas = datas.filter(
      item =>
        item.name ||
        item.code ||
        item.type ||
        item.status ||
        item.newTags ||
        item.moduleName ||
        item.pageTypeName ||
        item.description
    );

    const tagNames = metadatas.reduce((total, item) => {
      const newTags = item.newTags ? item.newTags.split(',') : [];
      return total.concat(newTags);
    }, []) as string[];

    // 先处理新增的标签
    const allMetadataTags = [];
    const newMetadataTags = [];
    for (let tagName of [...new Set(tagNames)]) {
      const oldTag = await this.metadataTagModel.findOne({ name: tagName, projectId });
      if (oldTag) {
        allMetadataTags.push(oldTag);
        continue;
      }
      const newMetadataTag = this.metadataTagModel.create({ name: tagName, project: { id: projectId }, projectId });
      newMetadataTags.push(newMetadataTag);
      await manager.save(MetadataTagModel, newMetadataTag);
    }

    allMetadataTags.push(...newMetadataTags);

    //处理模块

    const moduleNames = [...new Set(datas.filter(item => !!item.moduleName).map(item => item.moduleName))] as string[];
    const modules = await this.moduleModel.find({ name: In(moduleNames) });

    if (modules.length !== moduleNames.length) {
      throw new Error('模块不能未空');
    }

    //处理页面类型
    const pageTypes = await this.httpService
      .get<{ label: string; value: string }[]>('https://static.91jkys.com/dms/defa6d786f0531ab6fedb525705b53de.json')
      .toPromise();

    for (let key in metadatas) {
      const item = datas[key];
      if (!item.name || !item.code || !item.type) {
        throw `第${key}行格式错误`;
      }

      const pageType = pageTypes.data.find(i => i.label == item.pageTypeName);

      const curModule = modules.find(val => val.name == item.moduleName);
      const newMetadata = {
        projectId,
        name: item.name,
        code: item.code,
        url: item.url,
        type: this.getActionTypeName(item.type),
        status: item.status === '是' ? 1 : 0,
        moduleId: curModule ? curModule.id : null,
        pageType: pageType ? pageType.value : null,
        description: item.description
      };

      const { code } = newMetadata;
      const oldMetadata = await this.metadataModel.findOne({
        code: code,
        projectId
      });

      if (oldMetadata && oldMetadata.isDeleted === false && oldMetadata.name !== '') {
        throw new HttpBadRequestError(`第${key}行,元数据${code}重复`);
      }

      let metadataTags = [];

      const newTags = item.newTags ? item.newTags.split(',') : [];
      if (newTags && newTags.length) {
        for (const tagName of newTags) {
          metadataTags.push(allMetadataTags.find(val => val.name === tagName));
        }
      }
      if (oldMetadata) {
        oldMetadata.isDeleted = false;
        oldMetadata.name = newMetadata.name;
        oldMetadata.type = newMetadata.type;
        oldMetadata.status = newMetadata.status;
        oldMetadata.description = newMetadata.description;
        oldMetadata.moduleId = newMetadata.moduleId;
        oldMetadata.pageType = newMetadata.pageType;
        oldMetadata.tags = oldMetadata.tags || [];
        oldMetadata.tags.push(...metadataTags);
        await manager.save(MetadataModel, oldMetadata);

        continue;
      }
      const metadata =
        oldMetadata ||
        this.metadataModel.create({
          ...newMetadata,
          tags: []
        });

      metadata.tags.push(...metadataTags);
      await manager.save(MetadataModel, metadata);
    }

    return;
  }

  /**
   *修改metadata
   *
   * @param {UpdateMetadataDto} body
   * @returns {Promise<void>}
   * @memberof MetadataService
   */
  public async updateMetadata(body: UpdateMetadataDto): Promise<void> {
    let { id, tags, projectId } = body;
    let metadata = await this.metadataModel.findOne(id);
    // 获取已有的标签
    const metadataTags = await this.metadataTagModel.findByIds(tags);
    // 处理新增的标签
    if (body.newTags && body.newTags.length) {
      const newMetadataTagModels = [];
      body.newTags.forEach(item => {
        newMetadataTagModels.push(this.metadataTagModel.create({ name: item, project: { id: projectId }, projectId }));
      });
      const newMetadataTags = await this.metadataTagModel.save(newMetadataTagModels);
      metadataTags.push(...newMetadataTags);
    }
    metadata = { ...metadata, ...body, tags: [] };
    metadata.tags.push(...metadataTags);
    await this.metadataModel.save(metadata);
    return;
  }

  /**
   * 离线技术日志数
   * @param body
   */
  public async updateMetadataLog(body: UpdateMetadataLogDto): Promise<void> {
    let { id } = body;
    let metadata = await this.metadataModel.findOne(id);

    if (!metadata) {
      return;
    }
    const opt = {
      query: `trackId : "${metadata.code}"  and projectId : ${metadata.projectId}|SELECT COUNT(*) as count`,
      from: new Date(metadata.createdAt).getTime() - 86400000 * 30,
      to: Date.now()
    };

    const all = await this.slsService.query<any>(opt);

    if (Number(all[0].count) === metadata.log) {
      return;
    }
    opt.from = Date.now() - 86400000 * 3;
    const recent = await this.slsService.query<any>(opt);

    const optApp = {
      query: `trackId : "${metadata.code}"  and projectId : ${metadata.projectId} and appId:*|SELECT COUNT(*) as count`,
      from: new Date(metadata.createdAt).getTime() - 86400000 * 30,
      to: Date.now()
    };

    const allApp = await this.slsService.query<any>(optApp);
    optApp.from = Date.now() - 86400000 * 3;
    const recentApp = await this.slsService.query<any>(optApp);

    const result = {
      all: Number(all[0].count),
      recent: Number(recent[0].count),
      allApp: Number(allApp[0].count),
      recentApp: Number(recentApp[0].count)
    };

    if (!metadata.url) {
      const url = await this.slsService.query<any>({
        ...opt,
        query: `trackId : ${metadata.code} and projectId : ${metadata.projectId}|SELECT url group by url`
      });
      metadata.url = url[0] ? url[0].url : '';
    }

    metadata.log = result.all;
    metadata.recentLog = result.recent;

    metadata.logByApp = result.allApp;
    metadata.recentLogByApp = result.recentApp;

    metadata.logByH5 = result.all - result.allApp;
    metadata.recentLogByH5 = result.recent - result.recentApp;

    await this.metadataModel.save(metadata);
    return;
  }

  /**
   *修改metadata
   *
   * @param {UpdateMetadataDto} body
   * @returns {Promise<void>}
   * @memberof MetadataService
   */
  public async updateMetadataBatch(body: UpdateMetadataBatchDto, manager: EntityManager): Promise<void> {
    let { ids, tags, projectId, status, type } = body;
    const metadatas = await this.metadataModel.find({ where: { id: In(ids) }, relations: ['tags'] });
    switch (type) {
      case 'DEL':
        for (const metadata of metadatas) {
          if (metadata.log || metadata.status) {
            metadata.isDeleted = true;
            await manager.save(MetadataModel, metadata);
          } else {
            await manager.remove(MetadataModel, metadata);
          }
        }

        break;

      case 'TAG': {
        // 先处理新增的标签
        const newMetadataTags = [];
        for (let tagName of tags) {
          const tag = await this.metadataTagModel.findOne({ name: tagName, projectId });
          if (tag) {
            newMetadataTags.push(tag);
            continue;
          }
          const newMetadataTag = this.metadataTagModel.create({ name: tagName, project: { id: projectId }, projectId });
          newMetadataTags.push(newMetadataTag);
          await manager.save(MetadataTagModel, newMetadataTag);
        }

        for (const metadata of metadatas) {
          metadata.tags = metadata.tags || [];
          metadata.tags.push(...newMetadataTags);
          await manager.save(MetadataModel, metadata);
        }
        break;
      }

      default:
        {
          for (const metadata of metadatas) {
            metadata.status = status;
            await manager.save(MetadataModel, metadata);
          }
        }
        break;
    }
  }

  /**
   *删除metadata  如果有日志则不能真删除
   *
   * @param {number} id
   * @returns {Promise<void>}
   * @memberof MetadataService
   */
  public async deleteMetadata(id: number): Promise<void> {
    const metadata = await this.metadataModel.findOne(id);
    if (metadata.log || metadata.status) {
      metadata.isDeleted = true;
      await this.metadataModel.save(metadata);
    } else {
      await this.metadataModel.remove(metadata);
    }
    return;
  }

  public async enableMetadata(id: number): Promise<void> {
    let metadata = await this.metadataModel.findOne(id);
    metadata = { ...metadata, status: 1 };
    await this.metadataModel.save(metadata);
    return;
  }

  public async disableMetadata(id: number): Promise<void> {
    let metadata = await this.metadataModel.findOne(id);
    metadata = { ...metadata, status: 0 };
    await this.metadataModel.save(metadata);
    return;
  }

  public async getMetadatasByCodes(codes: string[]): Promise<MetadataModel[]> {
    return await this.metadataModel.find({
      code: In(codes)
    });
  }

  /**
   * 标签相关接口
   */

  public async getMetadataTags(query: QueryListQuery<QueryMetadataTagListDto>): Promise<PageData<MetadataTagModel>> {
    const searchBody: FindManyOptions<MetadataTagModel> = {
      skip: query.skip,
      take: query.take,
      where: { projectId: query.query.projectId },
      order: {}
    };

    const [metadataTag, totalCount] = await this.metadataTagModel.findAndCount(searchBody);
    return {
      totalCount,
      list: metadataTag
    };
  }

  public async addMetadataTag(body: AddMetadataTagDto): Promise<void> {
    const oldMetadata = await this.metadataTagModel.findOne({
      name: body.name,
      project: { id: body.projectId },
      projectId: body.projectId
    });
    if (oldMetadata) {
      throw new HttpBadRequestError('标签已经存在');
    }
    const metadata = this.metadataTagModel.create({
      ...body,
      project: { id: body.projectId }
    });
    await this.metadataTagModel.save(metadata);
    return;
  }

  public async updateMetadataTag(body: UpdateMetadataTagDto): Promise<void> {
    let metadataTag = await this.metadataTagModel.findOne(body.id);
    metadataTag = { ...metadataTag, ...body };
    await this.metadataTagModel.save(metadataTag);
    return;
  }

  public async deleteMetadataTag(id: number): Promise<void> {
    const metadataTag = await this.metadataTagModel.findOne(id);
    await this.metadataTagModel.remove(metadataTag);
    return;
  }

  /**
   * 定时查找未定义的元数据
   */
  public async scheduleIntervalFindMetadata(): Promise<void> {
    const client = await this.redisService.getClient();
    const projectIndex = Number(await client.get('projectCheckedIndex')) || 0;
    let projectIds = JSON.parse((await client.get('projectIds')) || '[]');

    if (!projectIds.length || projectIds.length < projectIndex + 1) {
      projectIds = (await this.projectModel.find({
        where: {
          status: 1,
          isDeleted: false
        }
      })).map(item => item.id);
      client.set('projectCheckedIndex', 0, 'PX', 60 * 24 * 3);
      client.set('projectIds', JSON.stringify(projectIds), 'PX', 60 * 24 * 3);
      return;
    }

    const projectId: number = projectIds[projectIndex];
    client.set('projectCheckedIndex', projectIndex + 1, 'PX', 60 * 24 * 3);

    const metadatas = await this.metadataModel.find({ projectId });

    const opt = {
      query: `trackId:* and projectId:${projectId}|SELECT trackId group by trackId`,
      from: new Date().setHours(0, 0, 0, 0) - 8640000 * 1,
      to: Date.now()
    };

    const result = await this.slsService.query<{ trackId: string }>(opt);

    if (result && result.length) {
      result
        .filter(item => !metadatas.find(val => val.code === item.trackId))
        .forEach(async item => {
          await this.addMetadata({
            code: item.trackId,
            projectId,
            name: '',
            newTags: ['未定义'],
            type: /page/.test(item.trackId) ? 1 : 2,
            status: 0,
            moduleName: '',
            pageType: null
          });
        });
    }
  }

  public async scheduleIntervalCheckMetadata(): Promise<void> {
    try {
      const client = await this.redisService.getClient();
      const metadataIndex = Number(await client.get('metadataCheckedIndex')) || 0;
      let metadataIds = JSON.parse((await client.get('metadataIds')) || '[]');

      if (!metadataIds.length || metadataIds.length < metadataIndex + 1) {
        metadataIds = (await this.metadataModel.find({
          where: {
            status: 1,
            isDeleted: false
          }
        })).map(item => item.id);
        client.set('metadataCheckedIndex', 0, 'PX', 60 * 24 * 3);
        client.set('metadataIds', JSON.stringify(metadataIds), 'PX', 60 * 24 * 3);
        return;
      }

      const metadataId = metadataIds[metadataIndex];
      client.set('metadataCheckedIndex', metadataIndex + 1, 'PX', 60 * 24 * 3);

      await this.updateMetadataLog({
        id: metadataId
      });
    } catch (error) {
      console.log('离线计算错误', error);
    }
  }

  public async scheduleCronComputedAllEventAttrRecommend(): Promise<void> {
    const client = await this.redisService.getClient();
    const eventAttrs = JSON.parse(JSON.stringify(EVENT_ATTRS));

    for (let attr of eventAttrs) {
      if (!attr.autoRecommend) {
        continue;
      }
      try {
        const opt = {
          // tslint:disable-next-line: max-line-length
          query: `* | select ${attr.value} , pv from( select count(1) as pv , ${attr.value} from (select ${attr.value} from log limit 100000) group by ${attr.value} order by pv desc) order by pv desc limit 10`,
          from: Date.now() - 86400 * 30,
          to: Date.now()
        };
        const result = await this.slsService.query(opt);
        attr.recommend.unshift(...result.map(item => ({ value: item[attr.value], text: item[attr.value] })));
        console.log(attr.recommend);
      } catch (error) {}
    }

    client.set(`eventAttrsRecommend`, JSON.stringify(eventAttrs), 'PX', 60 * 24 * 3);
  }

  public async scheduleCronComputedEventAttrRecommend(): Promise<void> {
    const client = await this.redisService.getClient();
    const metadataIndex = Number(await client.get('metadataComputeAttrIndex')) || 0;

    let metadataIds = JSON.parse((await client.get('metadataComputeAttrIds')) || '[]');
    const eventAttrs = JSON.parse(JSON.stringify(EVENT_ATTRS));

    // 计算所有 todo 直接copy
    if (!metadataIds.length || metadataIds.length < metadataIndex + 1) {
      metadataIds = (await this.metadataModel.find({
        where: {
          status: 1,
          isDeleted: false,
          recentLog: MoreThan(1000)
        }
      })).map(item => item.id);
      client.set('metadataComputeAttrIndex', 0, 'PX', 60 * 24 * 3);
      client.set('metadataComputeAttrIds', JSON.stringify(metadataIds), 'PX', 60 * 24 * 3);

      return;
    }

    const metadataId = metadataIds[metadataIndex];
    client.set('metadataComputeAttrIndex', metadataIndex + 1, 'PX', 60 * 24 * 3);

    const metadata = await this.metadataModel.findOne(metadataId);
    if (!metadata) {
      return;
    }

    for (let attr of eventAttrs) {
      if ((attr.eventType && metadata.type !== attr.eventType) || !attr.autoRecommend) {
        continue;
      }
      try {
        const opt = {
          // tslint:disable-next-line: max-line-length
          query: `trackId : ${metadata.code} and projectId :${metadata.projectId} | select ${attr.value} , pv from( select count(1) as pv , ${attr.value} from (select ${attr.value} from log limit 100000) group by ${attr.value} order by pv desc) order by pv desc limit 10`,
          from: Date.now() - 86400 * 30,
          to: Date.now()
        };
        const result = await this.slsService.query(opt);

        attr.recommend.unshift(...result.map(item => ({ value: item[attr.value], text: item[attr.value] })));
      } catch (e) {
        console.error('推荐离线查询错误');
      }
    }
    client.set(
      `eventAttrsRecommend${metadata.projectId}_${metadata.code}`,
      JSON.stringify(eventAttrs),
      'PX',
      60 * 24 * 3
    );
  }

  public async getFieldList(query: GetEventAttrDto): Promise<ListData<EventAttrsListDto>> {
    const client = await this.redisService.getClient();
    let key = 'eventAttrsRecommend';
    if (query.metadataCode !== '_ALL_METADATA') {
      key = `eventAttrsRecommend_${query.projectId}_${query.metadataCode}`;
    }
    let eventAttrsStr = (await client.get(key)) || (await client.get('eventAttrsRecommend'));
    const eventAttrs: EventAttrsListDto[] = eventAttrsStr ? JSON.parse(eventAttrsStr) : EVENT_ATTRS;
    return { list: eventAttrs };
  }
}
