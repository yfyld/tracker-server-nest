import {
  QueryMetadataListDto,
  AddMetadataDto,
  UpdateMetadataDto,
  QueryFieldListDto,
  AddMetadataTagDto,
  UpdateMetadataTagDto,
  QueryMetadataTagListDto
} from './metadata.dto';

import { MetadataModel, FieldModel, MetadataTagModel } from './metadata.model';
import { Injectable, HttpService } from '@nestjs/common';
import { Repository, In, LessThan, MoreThan, Between, Like, FindManyOptions } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

import { QueryListQuery, PageData } from '@/interfaces/request.interface';

import { HttpBadRequestError } from '@/errors/bad-request.error';
@Injectable()
export class MetadataService {
  constructor(
    @InjectRepository(MetadataModel)
    private readonly metadataModel: Repository<MetadataModel>,

    @InjectRepository(MetadataTagModel)
    private readonly metadataTagModel: Repository<MetadataTagModel>,

    @InjectRepository(FieldModel)
    private readonly fieldModel: Repository<FieldModel>
  ) {}

  public async getFields(query: QueryListQuery<QueryFieldListDto>): Promise<PageData<FieldModel>> {
    const searchBody: FindManyOptions<FieldModel> = {
      skip: query.skip,
      take: query.take,
      where: {},
      order: {}
    };

    if (query.sort.key) {
      searchBody.order[query.sort.key] = query.sort.value;
    }

    if (query.query.name) {
      (searchBody.where as any).name = Like(`%${query.query.name || ''}%`);
    }

    if (typeof query.query.status !== 'undefined') {
      (searchBody.where as any).status = query.query.status;
    }

    const [fields, totalCount] = await this.fieldModel.findAndCount(searchBody);
    return {
      totalCount,
      list: fields
    };
  }

  public async getActiveFields(query: any): Promise<any> {
    const fields = await this.fieldModel.find();
    return fields;
  }

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
    condition = 'metadata.projectId = :projectId and metadata.name like :name and metadata.code like :code';
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
      condition += ' and metadata.log = :log';
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
      newTags.forEach(item => {
        newMetadataTagModels.push(this.metadataTagModel.create({ name: item, project: { id: projectId }, projectId }));
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
}
