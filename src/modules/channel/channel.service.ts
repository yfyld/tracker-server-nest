import { Length } from 'class-validator';
import { AddChannelDto, AllChannelListItemDto } from './channel.dto';

// import { MetadataModel, FieldModel, MetadataTagModel } from './module.model';
import { Injectable, HttpService } from '@nestjs/common';
import { Repository, Like, In } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

import { QueryListQuery, PageData } from '@/interfaces/request.interface';

import { ChannelModel } from './channel.model';
import { Readable } from 'typeorm/platform/PlatformTools';
import { XlsxService } from '@/providers/xlsx/xlsx.service';
import { ChannelListItemDto, ChannelListReqDto, QueryChannelListDto, UpdateChannelDto } from './channel.dto';
import { HttpBadRequestError } from '@/errors/bad-request.error';
import * as moment from 'moment';
import Utils from '@/utils/utils';
import { EnumModel } from '../metadata/enum.model';

@Injectable()
export class ChannelService {
  constructor(
    @InjectRepository(ChannelModel)
    private readonly channelModel: Repository<ChannelModel>,

    @InjectRepository(EnumModel)
    private readonly enumModel: Repository<EnumModel>,

    private readonly xlsxervice: XlsxService
  ) {}

  private channelListParam(query: QueryListQuery<ChannelListReqDto>) {
    let {
      skip,
      take,
      sort: { key: sortKey, value: sortValue },
      query: { source, type, name, position, business }
    } = query;

    // 查询条件
    let condition: string = 'isDeleted = false';
    let params: {
      [propName: string]: any;
    } = {};

    if (name) {
      condition += ` and channel.name LIKE :name`;
      params.name = `%${name}%`;
    }

    if (name) {
      condition += ` or channel.channelId LIKE :channelId`;
      params.channelId = `%${name}%`;
    }

    if (type) {
      condition += ` and channel.type LIKE :type `;
      params.type = `%${type}%`;
    }

    if (source) {
      condition += ` and channel.source LIKE :source`;
      params.source = `%${source}%`;
    }

    if (business) {
      condition += ` and channel.business LIKE :business `;
      params.business = `%${business}%`;
    }

    if (position) {
      condition += ` and channel.position LIKE :position `;
      params.position = `%${position}%`;
    }

    return {
      condition,
      params,
      skip,
      take
    };
  }

  /**
   * getChannelByCodes
   */
  public async getChannelByCodes(channelIds) {
    if (!channelIds.length) {
      return [];
    }
    return await this.channelModel.find({ channelId: In(channelIds) });
  }

  /**
   *获取module List
   *
   * @memberof ChannelService
   */

  public async getChannelList(
    // currentUser: UserModel,
    query: QueryListQuery<ChannelListReqDto>
  ): Promise<PageData<ChannelListItemDto>> {
    const { condition, params, skip, take } = this.channelListParam(query);
    const { key, value } = query.sort;
    const order = {};
    if (typeof key !== 'string') {
      order['createdAt'] = 'DESC';
    } else {
      order[key] = value;
    }
    let [channel, totalCount] = await this.channelModel
      .createQueryBuilder('channel')
      .where(condition, params)
      .skip(query.skip)
      .take(query.take)
      .orderBy(order)
      .getManyAndCount();

    // const [channel, totalCount] = await this.channelModel.findAndCount({
    //   select: [
    //     'id',
    //     'name',
    //     'type',
    //     'business',
    //     'source',
    //     'position',
    //     'activity',
    //     'content',
    //     'keyword',
    //     'description',
    //     'createdAt',
    //     'channelId'
    //   ],
    //   where: [
    //     {
    //       name: Like(`%${query.query.name || ''}%`),
    //       isDeleted: 0
    //     },
    //     {
    //       id: Like(`%${query.query.name}%`),
    //       isDeleted: 0
    //     }
    //   ],
    //   skip: query.skip,
    //   take: query.take,
    //   order: {
    //     createdAt: 'DESC'
    //   }
    // });

    return {
      totalCount,
      list: channel
    };
  }

  public async getAllChannelList(
    // currentUser: UserModel,
    query: QueryListQuery<ChannelListReqDto>
  ): Promise<PageData<AllChannelListItemDto>> {
    const { condition, params, skip, take } = this.channelListParam(query);
    const { key, value } = query.sort;
    const order = {};
    if (typeof key !== 'string') {
      order['createdAt'] = 'DESC';
    } else {
      order[key] = value;
    }
    let [channels, totalCount] = await this.channelModel
      .createQueryBuilder('channel')
      .where(condition, params)
      .skip(query.skip)
      .take(query.take)
      .orderBy(order)
      .getManyAndCount();

    try {
      const positionMap = JSON.parse((await this.enumModel.findOne({ code: 'position' })).content).reduce(
        (total, item) => {
          total[item.value] = item.label;
          return total;
        },
        {}
      );

      const typeMap = JSON.parse((await this.enumModel.findOne({ code: 'type' })).content).reduce((total, item) => {
        total[item.value] = item.label;
        return total;
      }, {});

      const businessMap = JSON.parse((await this.enumModel.findOne({ code: 'business' })).content).reduce(
        (total, item) => {
          total[item.value] = item.label;
          return total;
        },
        {}
      );

      const sourceMap = JSON.parse((await this.enumModel.findOne({ code: 'source' })).content).reduce((total, item) => {
        total[item.value] = item.label;
        return total;
      }, {});

      const list = channels.map(item => {
        return {
          positionName: positionMap[item.position],
          typeName: typeMap[item.type],
          businessName: businessMap[item.business],
          sourceName: sourceMap[item.source],
          ...item
        };
      });

      return {
        totalCount,
        list
      };
    } catch (error) {
      console.error(error);
    }
  }

  /**
   * 根据渠道名加描述
   * @param channel: 渠道名+描述
   * @return Promise<void>
   */
  public async addChannel(channel: AddChannelDto): Promise<void> {
    const existedChannel = await this.channelModel.findOne({
      name: channel.name,
      isDeleted: 0
    });
    if (!existedChannel) {
      let newChannel = new ChannelModel();
      newChannel.name = channel.name;
      newChannel.type = channel.type;
      newChannel.business = channel.business;
      newChannel.source = channel.source;
      newChannel.position = channel.position;
      newChannel.activity = channel.activity;
      newChannel.content = channel.content;
      newChannel.keyword = channel.keyword;
      newChannel.description = channel.description;
      await newChannel.save();
      newChannel.channelId = Utils.enCodeID(newChannel.id);
      await newChannel.save();

      return;
    } else {
      throw new HttpBadRequestError(`渠道名${channel.name}已存在`);
    }
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
  public async updateChannel(body: UpdateChannelDto): Promise<void> {
    const { id } = body;

    const existedChannel = await this.channelModel.findOne({
      id,
      isDeleted: 0
    });

    if (existedChannel) {
      await this.channelModel
        .createQueryBuilder()
        .update(ChannelModel)
        .set(body)
        .where('id = :id', { id })
        .execute();
      return;
    }
  }

  public async exportExcel(query: QueryListQuery<QueryChannelListDto>): Promise<[Readable, number]> {
    const { condition, params, skip, take } = this.channelListParam(query);
    const { key, value } = query.sort;
    const order = {};
    if (typeof key !== 'string') {
      order['createdAt'] = 'DESC';
    } else {
      order[key] = value;
    }
    let [channels, totalCount] = await this.channelModel
      .createQueryBuilder('channel')
      .where(condition, params)
      .skip(query.skip)
      .take(query.take)
      .orderBy(order)
      .getManyAndCount();

    // const [channels, totalCount] = await this.channelModel.findAndCount({
    //   select: [
    //     'channelId',
    //     'name',
    //     'type',
    //     'business',
    //     'source',
    //     'position',
    //     'activity',
    //     'content',
    //     'keyword',
    //     'description',
    //     'createdAt'
    //   ],
    //   where: [
    //     {
    //       name: Like(`%${query.query.name || ''}%`),
    //       isDeleted: 0
    //     }
    //   ],
    //   skip: query.skip,
    //   take: query.take
    // });

    let data = [
      ['渠道id', '渠道名称', '渠道类型', '业务线', '来源', '位置', '活动', '内容', '关键字', '描述', '创建时间']
    ];
    data = data.concat(
      channels.map(item => {
        return [
          item.channelId.toString(),
          item.name.toString(),
          item.type.toString(),
          item.business.toString(),
          item.source.toString(),
          item.position.toString(),
          item.activity.toString(),
          item.content.toString(),
          item.keyword.toString(),
          item.description.toString(),
          moment(item.createdAt).format('L')
        ];
      })
    );

    const result = await this.xlsxervice.exportExcel(data);
    return result;
  }
}
