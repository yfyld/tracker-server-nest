import { QueryListQuery } from '@/interfaces/request.interface';
import { PageData } from '../../interfaces/request.interface';
import { ReportModel } from './report.model';
import { ReportService } from './report.service';
import { QueryReportListDto, AddReportDto } from './report.dto';
export declare class ReportController {
    private readonly reportService;
    constructor(reportService: ReportService);
    addReport(body: AddReportDto, user: any): Promise<void>;
    getReports(query: QueryListQuery<QueryReportListDto>): Promise<PageData<ReportModel>>;
    updateReport(reportId: number): Promise<void>;
}
