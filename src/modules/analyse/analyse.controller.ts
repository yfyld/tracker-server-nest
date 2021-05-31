import { ParsePageQueryIntPipe } from './../../pipes/parse-page-query-int.pipe';
import { AnalyseFunnelService } from './analyse.funnel.service';
import { AnalyseEventService } from './analyse.event.service';
import { AnalysePathService } from './analyse.path.service';
import { PERMISSION_CODE } from './../../constants/permission.contant';
import { PermissionsGuard } from '@/guards/permission.guard';
import { IAnalyseKaerData, IFunnelData, IPathData } from './analyse.interface';
import { ApiUseTags } from '@nestjs/swagger';
import { Controller, Post, UseGuards, Body, Get, Query } from '@nestjs/common';

import { HttpProcessor } from '@/decotators/http.decotator';

import { JwtAuthGuard } from '@/guards/auth.guard';
import { AnalyseService } from './analyse.service';
import {
  QueryEventAnalyseDataDto,
  QueryFunnelAnalyseDataDto,
  QueryPathAnalyseDataDto,
  QueryCustomAnalyseDataDto,
  QueryUserTimelineAnalyseDataDto,
  QueryCheckoutAnalyseDataDto,
  QueryKaerAnalyseDataDto
} from './analyse.dto';
import { Permissions } from '@/decotators/permissions.decotators';
@ApiUseTags('分析')
@Controller('analyse')
@UseGuards(JwtAuthGuard, PermissionsGuard)
export class AnalyseController {
  constructor(
    private readonly analyseService: AnalyseService,
    private readonly analysePathService: AnalysePathService,
    private readonly analyseEventService: AnalyseEventService,
    private readonly analyseFunnelService: AnalyseFunnelService
  ) {}

  @HttpProcessor.handle('事件分析')
  @Post('/event')
  @Permissions(PERMISSION_CODE.ANALYSE_EVENT)
  eventAnalyse(@Body() body: QueryEventAnalyseDataDto): Promise<any> {
    return this.analyseEventService.eventAnalyse(body);
  }

  @HttpProcessor.handle('漏斗分析')
  @Post('/funnel')
  @Permissions(PERMISSION_CODE.ANALYSE_FUNNEL)
  funnelAnalyse(@Body() body: QueryFunnelAnalyseDataDto): Promise<IFunnelData> {
    return this.analyseFunnelService.funnelAnalyse(body);
  }

  @HttpProcessor.handle('路径分析')
  @Post('/path')
  @Permissions(PERMISSION_CODE.ANALYSE_PATH)
  pathAnalyse(@Body() body: QueryPathAnalyseDataDto): Promise<IPathData> {
    return this.analysePathService.pathAnalyse(body);
  }

  @HttpProcessor.handle('自定义查询')
  @Post('/custom')
  @Permissions(PERMISSION_CODE.ANALYSE_CUSTOM)
  customAnalyse(@Body() body: QueryCustomAnalyseDataDto): Promise<unknown> {
    return this.analyseService.customAnalyse(body);
  }

  @HttpProcessor.handle('用户时间轴查询')
  @Post('/user-timeline')
  @Permissions(PERMISSION_CODE.SEARCH_USER_TIMELINE)
  userTimelineAnalyse(@Body() body: QueryUserTimelineAnalyseDataDto): Promise<unknown> {
    if (!body.uid && !body.deviceId && !body.ip && !body.custom) {
      throw new Error('uid,deviceId,ip不能都为空');
    }
    return this.analyseService.userTimeAnalyse(body);
  }

  @HttpProcessor.handle('验证数据')
  @Post('/checkout')
  @Permissions(PERMISSION_CODE.SEARCH_USER_TIMELINE) //todo
  checkoutAnalyse(@Body() body: QueryCheckoutAnalyseDataDto): Promise<unknown> {
    if (!body.uid && !body.deviceId && !body.ip && !body.custom && !body.slsquery) {
      throw new Error('uid,deviceId,ip不能都为空');
    }
    return this.analyseService.checkoutAnalyse(body);
  }

  @HttpProcessor.handle('卡尔pv&uv分析')
  @Get('/kaer')
  kaerAnalyse(
    @Query(new ParsePageQueryIntPipe(['dateEnd', 'dateStart'])) query: QueryKaerAnalyseDataDto
  ): Promise<IAnalyseKaerData> {
    return this.analyseService.kaerAnalyse(query);
  }
}
