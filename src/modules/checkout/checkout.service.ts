import { Readable } from 'typeorm/platform/PlatformTools';
import { XlsxService } from './../../providers/xlsx/xlsx.service';
import { MetadataModel } from './../metadata/metadata.model';
import { UserModel } from './../user/user.model';
import { Injectable } from '@nestjs/common';
import { AddCheckoutLogDto, UpdateCheckoutLogDto } from './checkout.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { CheckoutLogModel } from './checkout.model';
import { Repository, In } from 'typeorm';
import moment = require('moment');

@Injectable()
export class CheckoutService {
  constructor(
    @InjectRepository(CheckoutLogModel)
    private readonly checkoutLogModel: Repository<CheckoutLogModel>,
    @InjectRepository(MetadataModel)
    private readonly metadataModel: Repository<MetadataModel>,
    @InjectRepository(UserModel)
    private readonly userModel: Repository<UserModel>,
    private readonly xlsxervice: XlsxService
  ) {}

  /**
   * name
   */
  public async addCheckoutLog(info: AddCheckoutLogDto, user: UserModel): Promise<void> {
    const log = await this.checkoutLogModel.findOne({ logId: info.logId, type: info.type });
    if (!log) {
      const newLog = await this.checkoutLogModel.create({
        ...info,
        userId: user.id
      });
      await this.checkoutLogModel.save(newLog);
    } else {
      log.userId = user.id;
      log.description = info.description;
      log.status = info.status;
    }

    const metadata = await this.metadataModel.findOne({ code: info.trackId });
    if (metadata) {
      if (info.type) {
        metadata.selfCheckoutStatus = info.status;
      } else {
        metadata.checkoutStatus = info.status;
      }
      this.metadataModel.save(metadata);
    }
  }

  public async getCheckoutLogByLogIds(ids: string[]): Promise<CheckoutLogModel[]> {
    if (ids.length === 0) {
      return [];
    }
    return this.checkoutLogModel.find({ logId: In(ids) });
  }

  private statusToString(status) {
    switch (status) {
      case 0:
        return '不通过';

      case 2:
        return '通过';

      default:
        return '未测试';
    }
  }

  private getActionTypeName(type: number) {
    switch (type) {
      case 1:
        return '页面曝光';
      case 0:
        return '事件';
      case 2:
        return '区域曝光';
      default:
        return '';
    }
  }

  public async getCheckoutRecord(version: string): Promise<[Readable, number]> {
    const metadatas = await this.metadataModel.find({ version });
    const records = [['名称', 'code', '类型', '自测结果', '测试结果', '测试记录']];
    const users = await this.userModel.find();
    const userMapById = users.reduce(
      (total, item) => {
        total[item.id] = item;
        return total;
      },
      {} as { [prop: string]: UserModel }
    );
    for (let metadata of metadatas) {
      const checkoutLogs = await this.checkoutLogModel.find({ trackId: metadata.code });
      records.push([
        metadata.name,
        metadata.code,
        this.getActionTypeName(metadata.type),
        this.statusToString(metadata.selfCheckoutStatus),
        this.statusToString(metadata.checkoutStatus),
        checkoutLogs
          .reverse()
          .map(log => {
            return `${moment(log.createdAt).format('lll')}: ${log.type ? '自测' : '测试'}${this.statusToString(
              log.status
            )}${log.description ? `(${log.description})` : ''} 日志id:${log.logId} @${
              userMapById[log.userId] ? userMapById[log.userId].nickname : '未知用户'
            } `;
          })
          .join('\n')
      ]);
    }

    const result = await this.xlsxervice.exportExcel(records);
    return result;
  }
}
