import { ReportModel } from './../report/report.model';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, FindManyOptions, In } from 'typeorm';
import { BoardModel } from './board.model';
import {
  AddBoardDto,
  QueryBoardListDto,
  QueryBoardInfoDto,
  BoardInfoDto,
  UpdateBoardDto,
  AddReportToBoardDto,
  RemoveReportBoardDto
} from './board.dto';
import { Injectable } from '@nestjs/common';
import { UserModel } from '../user/user.model';
import { QueryListQuery, PageData } from '@/interfaces/request.interface';

@Injectable()
export class BoardService {
  constructor(
    @InjectRepository(BoardModel)
    private readonly boardModel: Repository<BoardModel>,
    @InjectRepository(ReportModel)
    private readonly reportModel: Repository<ReportModel>
  ) {}

  /**
   * addBoard
   */
  public async addBoard(body: AddBoardDto, user: UserModel): Promise<void> {
    const board = this.boardModel.create({
      creator: user,
      ...body,
      layout: JSON.stringify(body.layout)
    });
    await this.boardModel.save(board);
    return;
  }

  public async updateBoard(body: UpdateBoardDto): Promise<void> {
    let board = await this.boardModel.findOne({
      where: {
        id: body.id,
        projectId: body.projectId
      }
    });
    board = { ...board, ...body, layout: JSON.stringify(body.layout) };
    await this.boardModel.save(board);
    return;
  }

  public async getBoards(query: QueryListQuery<QueryBoardListDto>, user: UserModel): Promise<PageData<BoardModel>> {
    const searchBody: FindManyOptions<BoardModel> = {
      skip: query.skip,
      take: query.take,
      where: {}
    };

    if (typeof query.query.status !== 'undefined') {
      (searchBody.where as any).status = query.query.status;
    }
    if (typeof query.query.projectId !== 'undefined') {
      (searchBody.where as any).projectId = query.query.projectId;
    }
    if (typeof query.query.isPublic !== 'undefined') {
      (searchBody.where as any).isPublic = query.query.isPublic;
    } else {
      (searchBody.where as any).creator = { id: user.id };
    }

    const [boards, totalCount] = await this.boardModel.findAndCount(searchBody);
    return {
      totalCount,
      list: boards
    };
  }

  public async getBoardInfo(query: QueryBoardInfoDto): Promise<BoardModel> {
    const boardInfo = await this.boardModel.findOne({
      relations: ['reports'],
      where: { id: query.id, project: { id: query.projectId } }
    });

    if (!boardInfo.layout) {
      (boardInfo as any).layout = [];
    } else {
      (boardInfo as any).layout = JSON.parse(boardInfo.layout);
    }

    return boardInfo;
  }

  public async appendReportBoard(body: AddReportToBoardDto): Promise<void> {
    const { projectId, reportId, boardIds } = body;

    const report = await this.reportModel.findOne({
      where: {
        projectId,
        id: reportId
      }
    });

    if (!report) {
      throw '报表不存在';
    }

    const boards = await this.boardModel.find({
      id: In(boardIds)
    });
    if (!report.boards) {
      report.boards = [];
    }
    report.boards.push(...boards);
    await this.reportModel.save(report);
    for (let board of boards) {
      board.layout = JSON.stringify(
        JSON.parse(board.layout || '[]').concat([
          { w: 12, h: 8, x: 0, y: 0, i: '' + report.id, moved: false, static: false }
        ])
      );
      await this.boardModel.save(board);
    }
    return;
  }

  public async removeReportBoard(body: RemoveReportBoardDto): Promise<void> {
    const { projectId, reportId, boardId } = body;

    const board = await this.boardModel.findOne({
      where: {
        projectId,
        id: boardId
      }
    });

    if (!board) {
      throw '看板不存在';
    }
    board.reports = board.reports.filter(item => item.id !== reportId);
    await this.boardModel.save(board);
    return;
  }
}
