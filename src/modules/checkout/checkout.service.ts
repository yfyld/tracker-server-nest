import { MetadataModel } from './../metadata/metadata.model';
import { UserModel } from './../user/user.model';
import { Injectable } from '@nestjs/common';
import { AddCheckoutLogDto, UpdateCheckoutLogDto } from './checkout.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { CheckoutLogModel } from './checkout.model';
import { Repository, In } from 'typeorm';

@Injectable()
export class CheckoutService {
  constructor(
    @InjectRepository(CheckoutLogModel)
    private readonly checkoutLogModel: Repository<CheckoutLogModel>,
    @InjectRepository(MetadataModel)
    private readonly metadataModel: Repository<MetadataModel>
  ) {}

  /**
   * name
   */
  public async addCheckoutLog(info: AddCheckoutLogDto, user: UserModel): Promise<void> {
    const log = await this.checkoutLogModel.findOne({ logId: info.logId });
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
        metadata.checkoutStatus = info.status;
      } else {
        metadata.selfCheckoutStatus = info.status;
      }
      this.metadataModel.save(metadata);
    }
  }

  public async updateCheckoutLog(info: UpdateCheckoutLogDto, user: UserModel): Promise<void> {
    await this.checkoutLogModel.update(
      { id: info.id },
      {
        ...info,

        userId: user.id
      }
    );
    const metadata = await this.metadataModel.findOne({ code: info.trackId });
    if (metadata) {
      if (info.type) {
        metadata.checkoutStatus = info.status;
      } else {
        metadata.selfCheckoutStatus = info.status;
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
}
