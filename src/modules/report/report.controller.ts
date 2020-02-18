import { IResponseId } from './../../interfaces/request.interface';
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
import { QueryReportListDto, UpdateReportDto, AddReportDto, QueryFieldListDto, QueryReportInfoDto } from './report.dto';
import { Auth } from '@/decotators/user.decorators';
import { ParseIntPipe } from '@/pipes/parse-int.pipe';

@ApiUseTags('报告单')
@Controller('report')
// @UseGuards(JwtAuthGuard)
export class ReportController {
  constructor(private readonly reportService: ReportService) {}

  @HttpProcessor.handle('新增报告单')
  @Post('/')
  @UseGuards(JwtAuthGuard)
  addReport(@Body() body: AddReportDto, @Auth() user): Promise<IResponseId> {
    return this.reportService.addReport(body, user);
  }

  @HttpProcessor.handle('获取报告单列表')
  @UseGuards(JwtAuthGuard)
  @Get('/')
  getReports(
    @QueryList(new ParsePageQueryIntPipe(['projectId', 'status', 'boardId', 'inBoard']))
    query: QueryListQuery<QueryReportListDto>
  ): Promise<PageData<ReportModel>> {
    return this.reportService.getReports(query);
  }

  @HttpProcessor.handle('获取报告详情')
  @UseGuards(JwtAuthGuard)
  @Get('/info')
  getReportInfo(@Query(new ParseIntPipe(['projectId', 'id'])) query: QueryReportInfoDto): Promise<ReportModel> {
    return this.reportService.getReportInfo(query);
  }

  @HttpProcessor.handle('更新报告单')
  @Put('/')
  @UseGuards(JwtAuthGuard)
  updateReport(@Body() body: UpdateReportDto): Promise<void> {
    return this.reportService.updateReport(body);
  }

  @HttpProcessor.handle('删除报告单')
  @Delete('/:reportId')
  @UseGuards(JwtAuthGuard)
  deleteReport(@Param('reportId') reportId: number): Promise<void> {
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
