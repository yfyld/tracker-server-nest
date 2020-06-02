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
  GetEventAttrDto
} from './metadata.dto';

import { MetadataModel, FieldModel, MetadataTagModel } from './metadata.model';
import { Injectable, HttpService } from '@nestjs/common';
import { Repository, In, LessThan, MoreThan, Between, Like, FindManyOptions } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

import { QueryListQuery, PageData } from '@/interfaces/request.interface';

import { HttpBadRequestError } from '@/errors/bad-request.error';
import { SlsService } from '@/providers/sls/sls.service';
import { RedisService } from 'nestjs-redis';
import { XlsxService } from '@/providers/xlsx/xlsx.service';

import * as path from 'path';

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
      query: { projectId, status, type, name, code, tags, log }
    } = query;

    // 排序
    let orderBy: {
      [propName: string]: any;
    } = {};
    if (sortKey && sortValue) {
      orderBy[`metadata.${sortKey}`] = sortValue;
    }
    orderBy = Object.assign(orderBy, {
      'metadata.updatedAt': 'DESC'
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
      condition = 'metadata.projectId in (:projectIds) and metadata.name like :name and metadata.code like :code';
    } else {
      condition = 'metadata.projectId = :projectId and metadata.name like :name and metadata.code like :code';
    }

    params.projectId = projectId;

    params.name = `%${name || ''}%`;
    params.code = `%${code || ''}%`;

    if (typeof status !== 'undefined') {
      condition += ' and metadata.status = :status';
      params.status = status;
    }

    if (type) {
      condition += ' and metadata.type = :type';
      params.type = type;
    }

    if (tags) {
      condition += ' and tag.id in (:tags)';
      params.tags = tags.split(',');
    }

    if (log) {
      condition += log == 1 ? ' and metadata.log >= :log' : ' and metadata.log = :log';
      params.log = log;
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
      throw new HttpBadRequestError('元数据code重复');
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

  public async addMetadataByExcel(projectId: number, pathStr: string): Promise<void> {
    const datas = await this.xlsxervice.parseByPath(
      path.join(__dirname, '../../', pathStr),
      ['名称', 'code', '类型', '启用', '标签', 'URL', '备注'],
      ['name', 'code', 'type', 'status', 'newTags', 'url', 'description']
    );
    for (let item of datas) {
      if (!item.name || !item.code || !item.type) {
        throw '格式错误';
      }
      await this.addMetadata({
        projectId,
        name: item.name,
        code: item.code,
        url: item.url,
        type: item.type === '页面' ? 1 : 2,
        status: item.status === '是' ? 1 : 0,
        newTags: item.newTags ? item.newTags.split(',') : [],
        description: item.description
      });
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
    //   from: Math.floor(new Date(metadata.createdAt).getTime() / 1000),
    //   to: Math.floor(Date.now() / 1000)
    // };
    // const metadatas = await this.metadataModel.find({
    //   where: {
    //     status: 1,
    //     isDeleted: false
    //   }
    // });
  }

  public async scheduleIntervalCheckMetadata(): Promise<void> {
    const client = await this.redisService.getClient();
    const metadataIndex = Number(await client.get('metadataCheckedIndex')) || 0;

    const metadatas = await this.metadataModel.find({
      where: {
        status: 1,
        isDeleted: false
      }
    });

    if (!metadatas.length || metadatas.length < metadataIndex + 1) {
      client.set('metadataCheckedIndex', 0);
      return;
    }

    const metadata = metadatas[metadataIndex];

    client.set('metadataCheckedIndex', metadataIndex + 1);

    const opt = {
      query: `trackId : "${metadata.code}"|SELECT COUNT(*) as count`,
      from: Math.floor(new Date(metadata.createdAt).getTime() / 1000),
      to: Math.floor(Date.now() / 1000)
    };

    const all = await this.slsService.query<any>(opt);
    opt.from = Math.floor((Date.now() - 86400000 * 3) / 1000);
    const recent = await this.slsService.query<any>(opt);

    const result = {
      all: Number(all[0].count),
      recent: Number(recent[0].count)
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
    await this.metadataModel.save(metadata);
  }

  public async scheduleCronComputedEventAttrRecommend(): Promise<void> {
    const client = await this.redisService.getClient();
    const metadataIndex = Number(await client.get('metadataComputeAttrIndex')) || 0;

    const metadatas = await this.metadataModel.find({
      where: {
        status: 1,
        isDeleted: false,
        recentLog: MoreThan(1000)
      }
    });

    if (!metadatas.length || metadatas.length > metadataIndex + 1) {
      client.set('metadataComputeAttrIndex', 0);
      return;
    }

    const metadata = metadatas[metadataIndex];

    const eventAttrs = EVENT_ATTRS;

    for (let attr of eventAttrs) {
      if (attr.eventType && metadata.type !== attr.eventType) {
        continue;
      }
      const opt = {
        // tslint:disable-next-line: max-line-length
        query: `trackId : ${metadata.code} and projectId :${metadata.projectId} | select "${attr.value}" , pv from( select count(1) as pv , "${attr.value}" from (select "${attr.value}" from log limit 100000) group by "${attr.value}" order by pv desc) order by pv desc limit 10`,
        from: Math.floor(Date.now() / 1000 - 86400 * 30),
        to: Math.floor(Date.now() / 1000)
      };
      const result = await this.slsService.query(opt);

      attr.recommend = result.map(item => item[attr.value]);
    }
    client.set(`eventAttrsRecommend${metadata.projectId}_${metadata.code}`, JSON.stringify(eventAttrs));
  }

  public async getFieldList(query: GetEventAttrDto): Promise<ListData<EventAttrsListDto>> {
    const client = await this.redisService.getClient();
    let eventAttrsStr = await client.get(`eventAttrsRecommend_${query.projectId}_${query.metadataCode}`);
    const eventAttrs: EventAttrsListDto[] = eventAttrsStr ? JSON.parse(eventAttrsStr) : EVENT_ATTRS;
    return { list: eventAttrs };
  }
}
