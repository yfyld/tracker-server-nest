import { BoardModel } from './board.model';
import { AddBoardDto, QueryBoardListDto, QueryBoardInfoDto, BoardInfoDto, UpdateBoardDto, AddBoardReportDto } from './board.dto';
import { BoardService } from './board.service';
import { QueryListQuery, PageData } from '@/interfaces/request.interface';
export declare class BoardController {
    private readonly boardService;
    constructor(boardService: BoardService);
    addBoard(body: AddBoardDto, user: any): Promise<void>;
    updateBoard(body: UpdateBoardDto): Promise<void>;
    getBoards(query: QueryListQuery<QueryBoardListDto>, user: any): Promise<PageData<BoardModel>>;
    getBoardInfo(query: QueryBoardInfoDto): Promise<BoardInfoDto>;
    appendReport(body: AddBoardReportDto): Promise<void>;
}
