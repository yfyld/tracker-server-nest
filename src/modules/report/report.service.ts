import { IResponseId } from './../../interfaces/request.interface';
import {
  QueryReportListDto,
  ReportDto,
  SourceCodeDto,
  UpdateReportDto,
  AddReportDto,
  QueryFieldListDto,
  QueryReportInfoDto
} from './report.dto';

import { ReportModel } from './report.model';
import { Injectable, HttpService } from '@nestjs/common';
import { Repository, In, LessThan, MoreThan, Between, Like, FindManyOptions, IsNull } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

import { QueryListQuery, PageData } from '@/interfaces/request.interface';

import { HttpBadRequestError } from '@/errors/bad-request.error';
import { UserModel } from '../user/user.model';
import { BoardModel } from '../board/board.model';
@Injectable()
export class ReportService {
  constructor(
    @InjectRepository(ReportModel)
    private readonly reportModel: Repository<ReportModel>,
    @InjectRepository(BoardModel)
    private readonly boardModel: Repository<BoardModel>
  ) {}

  public async addReport(body: AddReportDto, user: UserModel): Promise<IResponseId> {
    const reportInfo = {
      ...body,
      board: null,
      creator: user,
      data: JSON.stringify(body.data)
    };

    const report = this.reportModel.create(reportInfo);
    await this.reportModel.save(report);

    return { id: report.id };
  }

  public async getReports(query: QueryListQuery<QueryReportListDto>): Promise<PageData<ReportModel>> {
    const searchBody: FindManyOptions<ReportModel> = {
      skip: query.skip,
      take: query.take,
      relations: ['boards'],
      where: {},
      order: {}
    };

    if (query.sort.key) {
      searchBody.order[query.sort.key] = query.sort.value;
    }

    if (typeof query.query.status !== 'undefined') {
      (searchBody.where as any).status = query.query.status;
    }

    if (typeof query.query.boardId !== 'undefined') {
      (searchBody.where as any).boardId = query.query.boardId;
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
    body.data = JSON.stringify(body.data);
    const report = await this.reportModel.findOne(body.id);
    const newReport = { ...report, ...body };
    await this.reportModel.save(newReport);
    return;
  }

  public async deleteReport(id: number): Promise<void> {
    const report = await this.reportModel.findOne(id);
    await this.reportModel.remove(report);
    return;
  }

  public async getReportInfo(query: QueryReportInfoDto): Promise<ReportModel> {
    const report = await this.reportModel.findOne({
      relations: ['boards'],
      where: query
    });

    report.data = report.data ? JSON.parse(report.data) : {};
    // report.dateEnd = Number(report.dateEnd);
    // report.dateStart = Number(report.dateStart);
    return report;
  }
}
