import { ALARM_INTERVAL } from '../../app.config';
import { InjectQueue } from 'nest-bull';
import { SourcemapModel, ProjectModel } from '../project/project.model';
import {
  QueryMetadataListDto,
  MetadataDto,
  SourceCodeDto,
  UpdateMetadataDto,
  AddMetadataDto,
} from './metadata.dto';

import { MetadataModel } from './metadata.model';
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

import { UserModel } from '@/modules/user/user.model';
import { QueryListQuery, PageData } from '@/interfaces/request.interface';
import * as SourceMap from 'source-map';
import { RedisService } from 'nestjs-redis';
import { Queue } from 'bull';
import * as moment from 'moment';
import { HttpBadRequestError } from '@/errors/bad-request.error';
@Injectable()
export class MetadataService {
  constructor(
    @InjectRepository(MetadataModel)
    private readonly metadataModel: Repository<MetadataModel>,

    @InjectRepository(ProjectModel)
    private readonly projectModel: Repository<ProjectModel>,
  ) {}

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
}
