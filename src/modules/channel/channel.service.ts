import { AddChannelDto } from './channel.dto';

// import { MetadataModel, FieldModel, MetadataTagModel } from './module.model';
import { Injectable, HttpService } from '@nestjs/common';
import { Repository, In, LessThan, MoreThan, Between, Like, FindManyOptions, EntityManager } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

import { QueryListQuery, PageData } from '@/interfaces/request.interface';

import { ChannelModel } from './channel.model';
import { Readable } from 'typeorm/platform/PlatformTools';
import { FieldModel } from '../metadata/metadata.model';
import { XlsxService } from '@/providers/xlsx/xlsx.service';
import { ChannelListItemDto, ChannelListReqDto, QueryChannelListDto, UpdateChannelDto } from './channel.dto';

@Injectable()
export class ChannelService {
  constructor(
    @InjectRepository(ChannelModel)
    private readonly channelModel: Repository<ChannelModel>,

    private readonly xlsxervice: XlsxService
  ) {}

  /**
   *获取module List
   *
   * @memberof ChannelService
   */

  public async getChannelList(
    // currentUser: UserModel,
    query: QueryListQuery<ChannelListReqDto>
  ): Promise<PageData<ChannelListItemDto>> {
    const [modules, totalCount] = await this.channelModel.findAndCount({
      select: [
        'id',
        'name',
        'type',
        'business',
        'source',
        'activity',
        'content',
        'keyword',
        'description',
        'createdAt'
      ],
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

  /**
   * 根据渠道名加描述
   * @param channel: 渠道名+描述
   * @return Promise<void>
   */
  public async addChannel(channel: AddChannelDto): Promise<void> {
    await this.channelModel
      .createQueryBuilder()
      .insert()
      .values(channel)
      .execute();
    return;
  }

  /**
   * 删除渠道
   * @param channelId: 渠道ID
   * @return Promise<void>
   */
  public async deleteChannel(channelId: number): Promise<void> {
    await this.channelModel
      .createQueryBuilder()
      .delete()
      .from(ChannelModel)
      .where('id = :channelId', { channelId })
      .execute();
    return;
  }

  /**
   * 更新渠道
   * @param channel: 渠道名+描述
   * @return Promise<void>
   */
  public async updateChannel({ description, name, id }: UpdateChannelDto): Promise<void> {
    await this.channelModel
      .createQueryBuilder()
      .update(ChannelModel)
      .set({ description, name })
      .where('id = :id', { id })
      .execute();
    return;
  }

  public async exportExcel(query: QueryListQuery<QueryChannelListDto>): Promise<[Readable, number]> {
    const [channels, totalCount] = await this.channelModel.findAndCount({
      select: [
        'id',
        'name',
        'type',
        'business',
        'source',
        'activity',
        'content',
        'keyword',
        'description',
        'createdAt'
      ],
      where: [
        {
          name: Like(`%${query.query.name || ''}%`),
          isDeleted: 0
        }
      ],
      skip: query.skip,
      take: query.take
    });

    let data = [['id', '渠道名称', '渠道类型', '业务线', '来源', '活动', '内容', '关键字', '描述', '创建时间']];
    console.log('exportExcel', channels);
    data = data.concat(
      channels.map(item => {
        return [
          item.id.toString(),
          item.name.toString(),
          item.type.toString(),
          item.business.toString(),
          item.source.toString(),
          item.activity.toString(),
          item.content.toString(),
          item.keyword.toString(),
          item.description.toString(),
          item.createdAt.toString()
        ];
      })
    );

    const result = await this.xlsxervice.exportExcel(data);
    return result;
  }
}
