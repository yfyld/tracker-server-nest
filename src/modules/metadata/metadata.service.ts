import { ListData } from './../../interfaces/request.interface';
import { IEventAttr } from './metadata.interface';
import { EVENT_ATTRS } from './../../constants/event.constant';
import {
  QueryMetadataListDto,
  MetadataDto,
  SourceCodeDto,
  AddMetadataDto,
  UpdateMetadataDto,
  QueryFieldListDto,
  AddMetadataTagDto,
  QueryMetadataTagListDto,
  EventAttrsListDto
} from './metadata.dto';

import { MetadataModel, FieldModel, MetadataTagModel } from './metadata.model';
import { Injectable, HttpService } from '@nestjs/common';
import { Repository, In, LessThan, MoreThan, Between, Like, FindManyOptions } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

import { QueryListQuery, PageData } from '@/interfaces/request.interface';

import { HttpBadRequestError } from '@/errors/bad-request.error';
import { SlsService } from '@/providers/sls/sls.service';
import { RedisService } from 'nestjs-redis';

@Injectable()
export class MetadataService {
  constructor(
    @InjectRepository(MetadataModel)
    private readonly metadataModel: Repository<MetadataModel>,

    @InjectRepository(MetadataTagModel)
    private readonly metadataTagModel: Repository<MetadataTagModel>,

    @InjectRepository(FieldModel)
    private readonly fieldModel: Repository<FieldModel>,
    private readonly slsService: SlsService,
    private readonly redisService: RedisService
  ) {}

  public async getMetadataList(query: QueryListQuery<QueryMetadataListDto>): Promise<PageData<MetadataModel>> {
    let {
      skip,
      take,
      sort: { key: sortKey, value: sortValue },
      query: { status, type, name, tags, log }
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
    condition = 'metadata.name like :name';
    params.name = `%${name || ''}%`;

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

  public async addMetadata(body: AddMetadataDto): Promise<void> {
    const { projectId, tags, newTags } = body;
    const oldMetadata = await this.metadataModel.findOne({
      code: body.code,
      projectId
    });
    if (oldMetadata) {
      throw new HttpBadRequestError('元数据code重复');
    }
    // 获取已有的标签
    const metadataTags = await this.metadataTagModel.findByIds(tags);
    // 处理新增的标签
    if (newTags && newTags.length) {
      const newMetadataTagModels = [];
      newTags.forEach(item => {
        newMetadataTagModels.push(this.metadataTagModel.create({ name: item, project: { id: projectId } }));
      });
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

  public async updateMetadata(body: UpdateMetadataDto): Promise<void> {
    let metadata = await this.metadataModel.findOne(body.id);
    // 获取已有的标签
    const metadataTags = await this.metadataTagModel.findByIds(body.tags);
    // 处理新增的标签
    if (body.newTags && body.newTags.length) {
      const newMetadataTagModels = [];
      body.newTags.forEach(item => {
        newMetadataTagModels.push(this.metadataTagModel.create({ name: item, project: { id: body.projectId } }));
      });
      const newMetadataTags = await this.metadataTagModel.save(newMetadataTagModels);
      metadataTags.push(...newMetadataTags);
    }
    metadata = { ...metadata, ...body, tags: [] };
    metadata.tags.push(...metadataTags);
    await this.metadataModel.save(metadata);
    return;
  }

  public async deleteMetadata(id: number): Promise<void> {
    const metadata = await this.metadataModel.findOne(id);
    await this.metadataModel.remove(metadata);
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

  public async addMetadataTag(body: AddMetadataTagDto): Promise<void> {
    const oldMetadata = await this.metadataTagModel.findOne({
      name: body.name,
      project: { id: body.projectId }
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

  public async scheduleIntervalCheckMetadata(): Promise<void> {
    const client = await this.redisService.getClient();
    const metadataId = Number(await client.get('metadataCheckedId')) || 1;

    const metadata = await this.metadataModel.findOne({
      where: {
        status: 1,
        id: metadataId
      }
    });
    client.set('metadataCheckedId', metadataId + 1);
    if (!metadata) {
      const metadataMaxId = Number(await client.get('metadataMaxId')) || 10;
      if (metadataId >= metadataMaxId) {
        client.set('metadataCheckedId', 1);
        const newmetadata = await this.metadataModel.findOne({
          where: {
            status: 1
          },
          order: {
            id: 'DESC'
          }
        });
        if (newmetadata) {
          client.set('metadataMaxId', newmetadata.id);
        }
      }
      return;
    }
    const result = await this.slsService.queryMetadata(metadata);
    if (result.all === metadata.log) {
      return;
    }
    metadata.log = result.all;
    metadata.recentLog = result.recent;
    await this.metadataModel.save(metadata);
  }

  public async scheduleCronComputedEventAttrRecommend(): Promise<void> {
    const client = await this.redisService.getClient();
    const eventAttrs = EVENT_ATTRS;

    for (let attr of eventAttrs) {
      const result = await this.slsService.queryEventValues(attr.value);
      attr.recommend = result;
    }
    client.set('eventAttrsRecommend', JSON.stringify(eventAttrs));
  }

  public async getFieldList(): Promise<ListData<EventAttrsListDto>> {
    const client = await this.redisService.getClient();
    let eventAttrsStr = await client.get('eventAttrsRecommend');
    const eventAttrs: EventAttrsListDto[] = eventAttrsStr ? JSON.parse(eventAttrsStr) : EVENT_ATTRS;
    return { list: eventAttrs };
  }
}
