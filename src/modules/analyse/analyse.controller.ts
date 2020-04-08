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
import { QueryEventAnalyseDataDto, QueryFunnelAnalyseDataDto, QueryPathAnalyseDataDto } from './analyse.dto';

@ApiUseTags('分析')
@Controller('analyse')
export class AnalyseController {
  constructor(private readonly analyseService: AnalyseService) {}

  @HttpProcessor.handle('event')
  @Post('/event')
  eventAnalyse(@Body() body: QueryEventAnalyseDataDto): Promise<any> {
    return this.analyseService.eventAnalyse(body);
  }

  @HttpProcessor.handle('funnel')
  @Post('/funnel')
  funnelAnalyse(@Body() body: QueryFunnelAnalyseDataDto): Promise<IFunnelData> {
    return this.analyseService.funnelAnalyse(body);
  }

  @HttpProcessor.handle('path')
  @Post('/path')
  pathAnalyse(@Body() body: QueryPathAnalyseDataDto): Promise<IPathData> {
    return this.analyseService.pathAnalyse(body);
  }
}
