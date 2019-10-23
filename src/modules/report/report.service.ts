import {
  QueryReportListDto,
  ReportDto,
  SourceCodeDto,
  UpdateReportDto,
  AddReportDto,
  QueryFieldListDto
} from './report.dto';

import { ReportModel } from './report.model';
import { Injectable, HttpService } from '@nestjs/common';
import { Repository, In, LessThan, MoreThan, Between, Like, FindManyOptions } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

import { QueryListQuery, PageData } from '@/interfaces/request.interface';

import { HttpBadRequestError } from '@/errors/bad-request.error';
import { UserModel } from '../user/user.model';
@Injectable()
export class ReportService {
  constructor(
    @InjectRepository(ReportModel)
    private readonly reportModel: Repository<ReportModel>
  ) {}

  public async addReport(body: AddReportDto, user: UserModel): Promise<void> {
    const report = this.reportModel.create({
      ...body,
      creator: user,
      data: JSON.stringify(body.data)
    });
    await this.reportModel.save(report);
    return;
  }

  public async getReports(query: QueryListQuery<QueryReportListDto>): Promise<PageData<ReportModel>> {
    const searchBody: FindManyOptions<ReportModel> = {
      skip: query.skip,
      take: query.take,
      where: {},
      order: {}
    };

    if (query.sort.key) {
      searchBody.order[query.sort.key] = query.sort.value;
    }

    if (typeof query.query.status !== 'undefined') {
      (searchBody.where as any).status = query.query.status;
    }

    if (typeof query.query.name !== 'undefined') {
      (searchBody.where as any).name = Like(`%${query.query.name || ''}%`);
    }

    const [report, totalCount] = await this.reportModel.findAndCount(searchBody);
    return {
      totalCount,
      list: report
    };
  }

  public async updateReport(body: UpdateReportDto): Promise<void> {
    const updateBody: any = {};
    if (body.actionType === 'LEVEL') {
      updateBody.level = body.level;
    } else if (body.actionType === 'STATUS') {
      updateBody.status = body.status;
    } else {
      updateBody.guarder = { id: body.guarderId };
    }
    await this.reportModel
      .createQueryBuilder()
      .update()
      .set(updateBody)
      .where('id IN (:...reportIds)', { reportIds: body.reportIds })
      .execute();
    return;
  }

  public async deleteReport(id: number): Promise<void> {
    const report = await this.reportModel.findOne(id);
    await this.reportModel.remove(report);
    return;
  }
}
