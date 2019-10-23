import { ParsePageQueryIntPipe } from '../../pipes/parse-page-query-int.pipe';

import { QueryListQuery } from '@/interfaces/request.interface';
import { QueryList } from '../../decotators/query-list.decorators';
import { PageData } from '../../interfaces/request.interface';
import {
  Controller,
  Get,
  Post,
  Body,
  UseGuards,
  HttpStatus,
  Query,
  Req,
  Delete,
  Param,
  Put,
  All,
  Render
} from '@nestjs/common';
import { ReportModel } from './report.model';
import { ReportService } from './report.service';
import { HttpProcessor } from '@/decotators/http.decotator';
import { JwtAuthGuard } from '@/guards/auth.guard';
import { ApiBearerAuth, ApiOperation, ApiUseTags, ApiResponse } from '@nestjs/swagger';
import { Permissions } from '@/decotators/permissions.decotators';
import { PermissionsGuard } from '@/guards/permission.guard';
import { QueryReportListDto, UpdateReportDto, AddReportDto, QueryFieldListDto } from './report.dto';
import { Auth } from '@/decotators/user.decorators';

@ApiUseTags('报告单')
@Controller('report')
// @UseGuards(JwtAuthGuard)
export class ReportController {
  constructor(private readonly reportService: ReportService) {}

  @HttpProcessor.handle('新增报告单')
  @Post('/')
  @UseGuards(JwtAuthGuard)
  addReport(@Body() body: AddReportDto, @Auth() user): Promise<void> {
    return this.reportService.addReport(body, user);
  }

  @HttpProcessor.handle('获取报告单列表')
  @UseGuards(JwtAuthGuard)
  @Get('/')
  getReports(
    @QueryList(new ParsePageQueryIntPipe(['projectId', 'status']))
    query: QueryListQuery<QueryReportListDto>
  ): Promise<PageData<ReportModel>> {
    return this.reportService.getReports(query);
  }

  @HttpProcessor.handle('删除报告单')
  @Delete('/:reportId')
  @UseGuards(JwtAuthGuard)
  updateReport(@Param('reportId') reportId: number): Promise<void> {
    return this.reportService.deleteReport(reportId);
  }

  // @HttpProcessor.handle('获取报告单信息')
  // @Get('/info')
  // @UseGuards(JwtAuthGuard)
  // getReportInfo(
  //   @Query('reportId') reportId: string,
  // ): Promise<ReportModel> {
  //   return this.reportService.getReportById(reportId);
  // }

  // @HttpProcessor.handle('获取报告单列表')
  // // @UseGuards(JwtAuthGuard)
  // @Get('/')
  // getReports(
  //   @QueryList(
  //     new ParsePageQueryIntPipe([
  //       'projectId',
  //       'endDate',
  //       'startDate',
  //       'level',
  //       'status',
  //       'guarder',
  //     ]),
  //   )
  //   query: QueryListQuery<QueryReportListDto>,
  // ): Promise<PageData<ReportModel>> {
  //   return this.reportService.getReports(query);
  // }

  // @HttpProcessor.handle('修改报告单')
  // @Put('/')
  // @UseGuards(JwtAuthGuard)
  // updateReport(@Body() body: UpdateReportDto): Promise<void> {
  //   return this.reportService.updateReport(body);
  // }
}
