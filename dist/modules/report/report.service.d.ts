import { QueryReportListDto, UpdateReportDto, AddReportDto } from './report.dto';
import { ReportModel } from './report.model';
import { Repository } from 'typeorm';
import { QueryListQuery, PageData } from '@/interfaces/request.interface';
import { UserModel } from '../user/user.model';
import { BoardModel } from '../board/board.model';
export declare class ReportService {
    private readonly reportModel;
    private readonly boardModel;
    constructor(reportModel: Repository<ReportModel>, boardModel: Repository<BoardModel>);
    addReport(body: AddReportDto, user: UserModel): Promise<void>;
    getReports(query: QueryListQuery<QueryReportListDto>): Promise<PageData<ReportModel>>;
    updateReport(body: UpdateReportDto): Promise<void>;
    deleteReport(id: number): Promise<void>;
}
