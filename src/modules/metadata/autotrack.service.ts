import { AutotrackModel } from './autotrack.model';

import { Injectable, HttpService } from '@nestjs/common';
import { Repository, In, LessThan, MoreThan, Between, Like, FindManyOptions, EntityManager } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class AutotrackService {
  constructor(
    @InjectRepository(AutotrackModel)
    private readonly autotrackModel: Repository<AutotrackModel>,
    private readonly httpService: HttpService
  ) {}

  public async getAutotrackList(code: string): Promise<{ label: string; value: string }[]> {
    return JSON.parse((await this.autotrackModel.findOne({ code })).content);
  }
}
