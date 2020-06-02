import { PERMISSION_CODE } from './../../constants/permission.contant';
import { PermissionsGuard } from '@/guards/permission.guard';
import { IFunnelData, IPathData } from './analyse.interface';
import { ApiOperation, ApiUseTags } from '@nestjs/swagger';
import { MULTER_OPTIONS, BASE_URL } from '../../app.config';
import { Controller, Post, UseInterceptors, UploadedFile, UseGuards, Get, Body } from '@nestjs/common';
import { diskStorage } from 'multer';
import { HttpProcessor } from '@/decotators/http.decotator';
import { FileInterceptor } from '@nestjs/platform-express';
import { existsSync, mkdirSync } from 'fs';
import { extname } from 'path';
import { JwtAuthGuard } from '@/guards/auth.guard';
import { AnalyseService } from './analyse.service';
import {
  QueryEventAnalyseDataDto,
  QueryFunnelAnalyseDataDto,
  QueryPathAnalyseDataDto,
  QueryCustomAnalyseDataDto
} from './analyse.dto';
import { Permissions } from '@/decotators/permissions.decotators';
@ApiUseTags('分析')
@Controller('analyse')
@UseGuards(JwtAuthGuard, PermissionsGuard)
export class AnalyseController {
  constructor(private readonly analyseService: AnalyseService) {}

  @HttpProcessor.handle('事件分析')
  @Post('/event')
  @Permissions(PERMISSION_CODE.ANALYSE_EVENT)
  eventAnalyse(@Body() body: QueryEventAnalyseDataDto): Promise<any> {
    return this.analyseService.eventAnalyse(body);
  }

  @HttpProcessor.handle('漏斗分析')
  @Post('/funnel')
  @Permissions(PERMISSION_CODE.ANALYSE_FUNNEL)
  funnelAnalyse(@Body() body: QueryFunnelAnalyseDataDto): Promise<IFunnelData> {
    return this.analyseService.funnelAnalyse(body);
  }

  @HttpProcessor.handle('路径分析')
  @Post('/path')
  @Permissions(PERMISSION_CODE.ANALYSE_PATH)
  pathAnalyse(@Body() body: QueryPathAnalyseDataDto): Promise<IPathData> {
    return this.analyseService.pathAnalyse(body);
  }

  @HttpProcessor.handle('自定义查询')
  @Post('/custom')
  @Permissions(PERMISSION_CODE.ANALYSE_PATH)
  customAnalyse(@Body() body: QueryCustomAnalyseDataDto): Promise<unknown> {
    return this.analyseService.customAnalyse(body);
  }
}
