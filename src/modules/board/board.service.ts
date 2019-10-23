import { InjectRepository } from '@nestjs/typeorm';
import { Repository, FindManyOptions } from 'typeorm';
import { BoardModel } from './board.model';
import { AddBoardDto, QueryBoardListDto } from './board.dto';
import { Injectable } from '@nestjs/common';
import { UserModel } from '../user/user.model';
import { QueryListQuery, PageData } from '@/interfaces/request.interface';

@Injectable()
export class BoardService {
  constructor(
    @InjectRepository(BoardModel)
    private readonly boardModel: Repository<BoardModel>
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
      list: boards.map(item => ({ ...item, layout: JSON.parse(item.layout) }))
    };
  }
}
