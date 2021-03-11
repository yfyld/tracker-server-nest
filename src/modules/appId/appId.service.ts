import { PermissionModel } from '@/modules/permission/permission.model';
import { Injectable, Inject, forwardRef } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like, In, FindManyOptions } from 'typeorm';
import Utils from '@/utils/utils';
import { AppIdModel } from './appId.model';
import { AppIdInsertDto, AppIdListDto } from './appId.dto';
import { PageData, QueryListQuery } from '@/interfaces/request.interface';
import { XlsxService } from '@/providers/xlsx/xlsx.service';
import { Readable } from 'stream';

@Injectable()
export class AppIdService {
  constructor(
    @InjectRepository(AppIdModel)
    private readonly appIdModel: Repository<AppIdModel>,
    private readonly xlsxervice: XlsxService
  ) {}

  /**
   * 添加权限
   * @param currentUser: 当前登录用户
   * @param body: 权限对象
   * @return Promise<PermissionListItemDto>
   */
  public async insert(body: AppIdInsertDto): Promise<void> {
    await this.appIdModel
      .createQueryBuilder()
      .insert()
      .values(body)
      .execute();
    return;
  }

  public async exportExcel(query: QueryListQuery<AppIdListDto>): Promise<[Readable, number]> {
    const where = {} as any;
    if (isNaN(Number(query.query.fuzzyName))) {
      where.appName = Like(`%${query.query.fuzzyName}%`);
    } else {
      where.appId = Like(`%${query.query.fuzzyName}%`);
    }
    const [modules, totalCount] = await this.appIdModel.findAndCount({
      select: ['appId', 'appName', 'business', 'clientType', 'subordinateType'],
      where: [
        {
          name: Like(`%${query.query.fuzzyName || ''}%`),
          isDeleted: 0
        }
      ],
      skip: query.skip,
      take: query.take
    });

    let data = [['appId', '应用名称', '业务线', '客户端类型', '从属端类型']];
    console.log('exportExcel', modules);
    data = data.concat(
      modules.map(item => {
        return [
          item.appId.toString(),
          item.appName.toString(),
          item.business.toString(),
          item.clientType.toString(),
          item.subordinateType.toString()
        ];
      })
    );
    const result = await this.xlsxervice.exportExcel(data);
    return result;
  }

  /**
   * 添加权限
   * @param currentUser: 当前登录用户
   * @param body: 权限对象
   * @return Promise<PermissionListItemDto>
   */
  public async getList(query: QueryListQuery<AppIdListDto>): Promise<PageData<AppIdModel>> {
    const findParam: FindManyOptions<AppIdModel> = {
      skip: query.skip,
      take: query.take,
      where: {
        isDeleted: 0
      }
    };
    if (isNaN(Number(query.query.fuzzyName))) {
      (findParam as any).where.appName = Like(`%${query.query.fuzzyName}%`);
    } else {
      (findParam as any).where.appId = Like(`%${query.query.fuzzyName}%`);
    }
    const [projects, totalCount] = await this.appIdModel.findAndCount(findParam);
    return {
      totalCount,
      list: projects
    };
  }
}
