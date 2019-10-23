import {
  QueryMetadataListDto,
  MetadataDto,
  SourceCodeDto,
  UpdateMetadataDto,
  AddMetadataDto,
  QueryFieldListDto,
  AddMetadataTagDto,
  QueryMetadataTagListDto,
} from './metadata.dto';

import { MetadataModel, FieldModel, MetadataTagModel } from './metadata.model';
import { Injectable, HttpService } from '@nestjs/common';
import {
  Repository,
  In,
  LessThan,
  MoreThan,
  Between,
  Like,
  FindManyOptions,
} from 'typeorm';
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
    private readonly fieldModel: Repository<FieldModel>,
  ) {}

  public async getFields(
    query: QueryListQuery<QueryFieldListDto>,
  ): Promise<PageData<FieldModel>> {
    const searchBody: FindManyOptions<FieldModel> = {
      skip: query.skip,
      take: query.take,
      where: {},
      order: {},
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
      list: fields,
    };
  }

  public async getActiveFields(query: any): Promise<any> {
    const fields = await this.fieldModel.find();
    return fields;
  }

  public async addMetadata(body: AddMetadataDto): Promise<void> {
    const oldmetadata = await this.metadataModel.findOne({
      code: body.code,
      projectId: body.projectId,
    });
    if (oldmetadata) {
      throw new HttpBadRequestError('元数据code重复');
    }
    const metadata = this.metadataModel.create({
      ...body,
    });
    await this.metadataModel.save(metadata);
    return;
  }

  public async getMetadatas(
    query: QueryListQuery<QueryMetadataListDto>,
  ): Promise<PageData<MetadataModel>> {
    const searchBody: FindManyOptions<MetadataModel> = {
      skip: query.skip,
      take: query.take,
      where: {
        name: Like(`%${query.query.name || ''}%`),
      },
      order: {},
    };

    if (query.sort.key) {
      searchBody.order[query.sort.key] = query.sort.value;
    }
    if (typeof query.query.status !== 'undefined') {
      (searchBody.where as any).status = query.query.status;
    }

    const [metadata, totalCount] = await this.metadataModel.findAndCount(
      searchBody,
    );
    return {
      totalCount,
      list: metadata,
    };
  }

  public async updateMetadata(body: UpdateMetadataDto): Promise<void> {
    const updateBody: any = {};
    if (body.actionType === 'LEVEL') {
      updateBody.level = body.level;
    } else if (body.actionType === 'STATUS') {
      updateBody.status = body.status;
    } else {
      updateBody.guarder = { id: body.guarderId };
    }
    await this.metadataModel
      .createQueryBuilder()
      .update()
      .set(updateBody)
      .where('id IN (:...metadataIds)', { metadataIds: body.metadataIds })
      .execute();
    return;
  }

  public async addMetadataTag(body: AddMetadataTagDto): Promise<void> {
    const oldmetadata = await this.metadataTagModel.findOne({
      name: body.name,
      project: { id: body.projectId },
    });
    if (oldmetadata) {
      throw new HttpBadRequestError('标签已经存在');
    }
    const metadata = this.metadataTagModel.create({
      ...body,
      project: { id: body.projectId },
    });
    await this.metadataTagModel.save(metadata);
    return;
  }

  public async getMetadataTags(
    query: QueryListQuery<QueryMetadataTagListDto>,
  ): Promise<PageData<MetadataTagModel>> {
    const searchBody: FindManyOptions<MetadataTagModel> = {
      skip: query.skip,
      take: query.take,
      where: { projectId: query.query.projectId },
      order: {},
    };

    const [metadataTag, totalCount] = await this.metadataTagModel.findAndCount(
      searchBody,
    );
    return {
      totalCount,
      list: metadataTag,
    };
  }
}
