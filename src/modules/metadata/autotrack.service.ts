import { QueryAutotrackListDto } from './autotrack.dto';
import { QueryListQuery } from './../../interfaces/request.interface';
import { UserModel } from './../user/user.model';
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

  public async getAutotrackList(query: QueryListQuery<QueryAutotrackListDto>, user: UserModel): Promise<any> {
    return;
  }
}
