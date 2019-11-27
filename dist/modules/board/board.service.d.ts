import { ReportModel } from './../report/report.model';
import { Repository } from 'typeorm';
import { BoardModel } from './board.model';
import { AddBoardDto, QueryBoardListDto, QueryBoardInfoDto, BoardInfoDto, UpdateBoardDto } from './board.dto';
import { UserModel } from '../user/user.model';
import { QueryListQuery, PageData } from '@/interfaces/request.interface';
export declare class BoardService {
    private readonly boardModel;
    private readonly reportModel;
    constructor(boardModel: Repository<BoardModel>, reportModel: Repository<ReportModel>);
    addBoard(body: AddBoardDto, user: UserModel): Promise<void>;
    updateBoard(body: UpdateBoardDto): Promise<void>;
    getBoards(query: QueryListQuery<QueryBoardListDto>, user: UserModel): Promise<PageData<BoardModel>>;
    getBoardInfo(query: QueryBoardInfoDto): Promise<BoardInfoDto>;
}
