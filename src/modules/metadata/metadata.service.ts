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

@Injectable()
export class MetadataService {
  constructor(
    @InjectRepository(MetadataModel)
    private readonly metadataModel: Repository<MetadataModel>,

    @InjectRepository(MetadataTagModel)
    private readonly metadataTagModel: Repository<MetadataTagModel>,

    @InjectRepository(ProjectModel)
    private readonly projectModel: Repository<ProjectModel>,

    @InjectRepository(FieldModel)
    private readonly fieldModel: Repository<FieldModel>,
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

  /**
   *获取metadata List
   *
   * @memberof MetadataService
   */
  public async getMetadataList(query: QueryListQuery<QueryMetadataListDto>): Promise<PageData<MetadataModel>> {
    let {
      skip,
      take,
      sort: { key: sortKey, value: sortValue },
      query: { projectId, status, type, name, code, tags, log, operatorType }
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
    let condition: string = '';
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
      condition = 'metadata.projectId in (:projectIds)';
    } else {
      condition = 'metadata.projectId = :projectId';
    }

    params.projectId = projectId;

    if (name) {
      condition += ` and metadata.name = :name `;
      params.name = name;
    }

    if (code) {
      condition += ` and metadata.code = :code `;
      params.code = code;
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

    const [metadata, totalCount] = await this.metadataModel
      .createQueryBuilder('metadata')
      .leftJoinAndSelect('metadata.tags', 'tag')
      .where(condition, params)
      .skip(skip)
      .take(take)
      .orderBy(orderBy)
      .getManyAndCount();

    return {
      totalCount,
      list: metadata
    };
  }

  public async exportExcel(): Promise<[Readable, number]> {
    const result = await this.xlsxervice.exportExcel();
    return result;
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
      projectId
    });
    if (oldMetadata) {
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
        if (await this.metadataTagModel.findOne({ name: item })) {
          continue;
        }
        newMetadataTagModels.push(this.metadataTagModel.create({ name: item, project: { id: projectId }, projectId }));
      }
      const newMetadataTags = await this.metadataTagModel.save(newMetadataTagModels);
      metadataTags.push(...newMetadataTags);
    }
    const metadata = this.metadataModel.create({
      ...body,
      tags: []
    });
    metadata.tags.push(...metadataTags);
    await this.metadataModel.save(metadata);
    return;
  }

  public async addMetadataByExcel(projectId: number, pathStr: string, manager: EntityManager): Promise<void> {
    const datas = await this.xlsxervice.parseByPath(
      path.join(__dirname, '../../', pathStr),
      ['名称', 'code', '类型', '启用', '标签', '备注'],
      ['name', 'code', 'type', 'status', 'newTags', 'description']
    );

    const metadatas = datas.filter(
      item => item.name || item.code || item.type || item.status || item.newTags || item.description
    );

    const tagNames = metadatas.reduce((total, item) => {
      const newTags = item.newTags ? item.newTags.split(',') : [];
      return total.concat(newTags);
    }, []) as string[];

    // 先处理新增的标签
    const newMetadataTags = [];
    for (let tagName of [...new Set(tagNames)]) {
      if (await this.metadataTagModel.findOne({ name: tagName, projectId })) {
        continue;
      }
      const newMetadataTag = this.metadataTagModel.create({ name: tagName, project: { id: projectId }, projectId });
      newMetadataTags.push(newMetadataTag);
      await manager.save(MetadataTagModel, newMetadataTag);
    }

    for (let key in metadatas) {
      const item = datas[key];
      if (!item.name || !item.code || !item.type) {
        throw `第${key}行格式错误`;
      }

      const newMetadata = {
        projectId,
        name: item.name,
        code: item.code,
        url: item.url,
        type: item.type === '页面' ? 1 : 2,
        status: item.status === '是' ? 1 : 0,
        description: item.description
      };

      const { code } = newMetadata;
      const oldMetadata = await this.metadataModel.findOne({
        code: code,
        projectId
      });

      if (oldMetadata) {
        throw new HttpBadRequestError(`第${key}行,元数据${code}重复`);
      }

      let metadataTags = [];

      const newTags = item.newTags ? item.newTags.split(',') : [];
      if (newTags && newTags.length) {
        for (const tagName of newTags) {
          metadataTags.push(newMetadataTags.find(val => val.name === tagName));
        }
      }
      const metadata = this.metadataModel.create({
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

    if (result.all === metadata.log) {
      return;
    }

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
    let { ids, newTags, projectId, status, type } = body;
    const metadatas = await this.metadataModel.find({ id: In(ids) });
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

      case 'UPDATE':
        for (const metadata of metadatas) {
          metadata.status = status;
          await manager.save(MetadataModel, metadata);
        }
        break;

      case 'TAG': {
        // 先处理新增的标签
        const newMetadataTags = [];
        for (let tagName of newTags) {
          if (await this.metadataTagModel.findOne({ name: tagName, projectId })) {
            continue;
          }
          const newMetadataTag = this.metadataTagModel.create({ name: tagName, project: { id: projectId }, projectId });
          newMetadataTags.push(newMetadataTag);
          await manager.save(MetadataTagModel, newMetadataTag);
        }

        for (const metadata of metadatas) {
          metadata.tags.push(...newMetadataTags);
          await manager.save(MetadataModel, metadata);
        }
        break;
      }

      default:
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

  public async scheduleIntervalFindMetadata(): Promise<void> {
    // const client = await this.redisService.getClient();
    // const metadataIndex = Number(await client.get(`metadataCode_${}`)) || 0;
    // const opt = {
    //   query: `trackId : ""|SELECT COUNT(*) as count`,
    //   from: new Date(metadata.createdAt).getTime(),
    //   to: Date.now()
    // };
    // const metadatas = await this.metadataModel.find({
    //   where: {
    //     status: 1,
    //     isDeleted: false
    //   }
    // });
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
        client.set('metadataCheckedIndex', 0);
        client.set('metadataIds', JSON.stringify(metadataIds));
        return;
      }

      const metadataId = metadataIds[metadataIndex];
      client.set('metadataCheckedIndex', metadataIndex + 1);

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

    client.set(`eventAttrsRecommend`, JSON.stringify(eventAttrs));
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
      client.set('metadataComputeAttrIndex', 0);
      client.set('metadataComputeAttrIds', JSON.stringify(metadataIds));

      return;
    }

    const metadataId = metadataIds[metadataIndex];
    client.set('metadataComputeAttrIndex', metadataIndex + 1);

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
    client.set(`eventAttrsRecommend${metadata.projectId}_${metadata.code}`, JSON.stringify(eventAttrs));
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
