import { EnumModel } from './enum.model';

import { Injectable, HttpService } from '@nestjs/common';
import { Repository, In, LessThan, MoreThan, Between, Like, FindManyOptions, EntityManager } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class EnumService {
  constructor(
    @InjectRepository(EnumModel)
    private readonly enumModel: Repository<EnumModel>,
    private readonly httpService: HttpService
  ) {}

  /**
   *根据code查询metadata
   *
   * @param {string} code
   * @param {number} projectId
   * @returns {Promise<EnumModel>}
   * @memberof EnumService
   */
  public async scheduleIntervalUpdateEnum(): Promise<void> {
    try {
      const data = [
        {
          code: 'business',
          link: 'http://static.91jkys.com/dms/4a9d9041e27a9329ef375bd96c6e300f.json',
          description: '渠道业务线枚举值'
        },
        {
          code: 'pagetype',
          link: 'http://static.91jkys.com/dms/defa6d786f0531ab6fedb525705b53de.json',
          description: '元数据页面类型枚举值'
        },
        {
          code: 'source',
          link: 'http://static.91jkys.com/dms/f41e7e437fe584a35b706606b8265472.json',
          description: '渠道来源枚举值'
        },
        {
          code: 'type',
          link: 'http://static.91jkys.com/dms/6bf13c080651121762af397b9950efc0.json',
          description: '渠道类型枚举值'
        },
        {
          code: 'position',
          link: 'http://static.91jkys.com/dms/db2c801a688f0963d51503bedaa8ff31.json',
          description: '渠道位子枚举值'
        }
      ];

      for (let item of data) {
        const content = (await this.httpService.get<{ label: string; value: string }[]>(item.link).toPromise()).data;

        const newData = await this.enumModel.findOne({ code: item.code });
        if (newData) {
          newData.content = JSON.stringify(content);
          await this.enumModel.save(newData);
        } else {
          const newData = this.enumModel.create({
            code: item.code,
            description: item.description,
            content: JSON.stringify(content)
          });
          await this.enumModel.save(newData);
        }
      }
    } catch (error) {
      console.error(error);
    }

    return null;
  }

  public async getEnumList(code: string): Promise<{ label: string; value: string }[]> {
    return JSON.parse((await this.enumModel.findOne({ code })).content);
  }
}
