import { UserModel } from './../user/user.model';
import { TransactionManager, EntityManager, Transaction } from 'typeorm';
import { PERMISSION_CODE } from './../../constants/permission.contant';
import { PermissionsGuard } from '@/guards/permission.guard';
import { ParsePageQueryIntPipe } from '../../pipes/parse-page-query-int.pipe';
import { ParseIntPipe } from './../../pipes/parse-int.pipe';

import { QueryListQuery, ListData } from '@/interfaces/request.interface';
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
  Render,
  Res
} from '@nestjs/common';
import { MetadataModel, FieldModel, MetadataTagModel } from './metadata.model';
import { MetadataService } from './metadata.service';
import { HttpProcessor } from '@/decotators/http.decotator';
import { JwtAuthGuard } from '@/guards/auth.guard';
import { ApiBearerAuth, ApiOperation, ApiUseTags, ApiResponse } from '@nestjs/swagger';
import {
  QueryMetadataListDto,
  UpdateMetadataDto,
  UpdateMetadataLogDto,
  AddMetadataDto,
  EventAttrsListDto,
  QueryMetadataTagListDto,
  AddMetadataTagDto,
  UpdateMetadataTagDto,
  QueryFieldListDto,
  AddMetadataByExcelDto,
  GetEventAttrDto,
  UpdateMetadataBatchDto,
  GetMetadataInfoDto
} from './metadata.dto';
import { XlsxService } from '@/providers/xlsx/xlsx.service';
import { Permissions } from '@/decotators/permissions.decotators';
import { Response } from 'express';
import { Auth } from '@/decotators/user.decorators';
import { PageTypes } from '@/constants/common.constant';
import * as moment from 'moment';

@ApiUseTags('元数据')
@Controller('metadata')
@UseGuards(JwtAuthGuard, PermissionsGuard)
export class MetadataController {
  constructor(private readonly metadataService: MetadataService) {}

  @HttpProcessor.handle('新增元数据')
  @Post('/')
  @Permissions(PERMISSION_CODE.METADATA_ADD)
  addMetadata(@Body() body: AddMetadataDto): Promise<void> {
    return this.metadataService.addMetadata(body);
  }

  @HttpProcessor.handle('上传元数据')
  @Post('/upload')
  @Transaction()
  @Permissions(PERMISSION_CODE.METADATA_ADD)
  addMetadataByExcel(@Body() body: AddMetadataByExcelDto, @TransactionManager() manager: EntityManager): Promise<void> {
    return this.metadataService.addMetadataByExcel(body.projectId, body.url, manager);
  }

  @HttpProcessor.handle('校验元数据,临时')
  @Get('/check')
  test(): Promise<any> {
    return this.metadataService.test(`http://yfyld.oss-cn-hangzhou.aliyuncs.com/code.xlsx`);
  }
  @HttpProcessor.handle('校验元数据,临时')
  @Get('/check2')
  test2(@Query('id', new ParseIntPipe()) id: number): Promise<any> {
    return this.metadataService.test2(id);
  }

  @HttpProcessor.handle('更新元数据')
  @Put('/')
  @Permissions(PERMISSION_CODE.METADATA_UPDATE)
  updateMetadata(@Body() body: UpdateMetadataDto): Promise<void> {
    return this.metadataService.updateMetadata(body);
  }

  @HttpProcessor.handle('更新元数据日志数据')
  @Put('/log')
  @Permissions(PERMISSION_CODE.METADATA_UPDATE)
  updateMetadataLog(@Body() body: UpdateMetadataLogDto): Promise<void> {
    return this.metadataService.updateMetadataLog(body);
  }

  @HttpProcessor.handle('批量更新元数据')
  @Post('/batch')
  @Transaction()
  @Permissions(PERMISSION_CODE.METADATA_UPDATE)
  updateMetadataBatch(
    @Body() body: UpdateMetadataBatchDto,
    @TransactionManager() manager: EntityManager
  ): Promise<void> {
    return this.metadataService.updateMetadataBatch(body, manager);
  }

  @HttpProcessor.handle('删除元数据')
  @Delete('/')
  @Permissions(PERMISSION_CODE.METADATA_DEL)
  deleteMetadata(@Query('metadataId', new ParseIntPipe()) metadataId: number): Promise<void> {
    return this.metadataService.deleteMetadata(metadataId);
  }

  @HttpProcessor.handle('启用元数据')
  @Put('/enable/:projectId/:metadataId')
  @Permissions(PERMISSION_CODE.METADATA_ENABLE)
  enableMetadata(@Param('metadataId', new ParseIntPipe()) metadataId: number): Promise<void> {
    return this.metadataService.enableMetadata(metadataId);
  }

  @HttpProcessor.handle('停用元数据')
  @Put('/disable/:projectId/:metadataId')
  @Permissions(PERMISSION_CODE.METADATA_DISABLE)
  disableMetadata(@Param('metadataId', new ParseIntPipe()) metadataId: number): Promise<void> {
    return this.metadataService.disableMetadata(metadataId);
  }

  @HttpProcessor.handle('获取元数据列表')
  @Permissions(PERMISSION_CODE.METADATA_SEARCH)
  @Get('/')
  getMetadataList(
    @QueryList(new ParsePageQueryIntPipe(['projectId', 'status', 'operatorType']))
    query: QueryListQuery<QueryMetadataListDto>,
    @Auth() user: UserModel
  ): Promise<PageData<MetadataModel>> {
    return this.metadataService.getMetadataList(query, user);
  }

  @HttpProcessor.handle('通过 code 查询元数据')
  @Get('/info/:code')
  @Permissions(PERMISSION_CODE.METADATA_SEARCH)
  getMetadataInfoByCode(@Param('code') code: string): Promise<MetadataModel> {
    return this.metadataService.getMetadataInfoByCode(code);
  }

  @HttpProcessor.handle('通过 code Array 批量查询元数据')
  @Get('/infos')
  @Permissions(PERMISSION_CODE.METADATA_SEARCH)
  getMetadataInfosByCodes(@Query() query: GetMetadataInfoDto): Promise<MetadataModel[]> {
    return this.metadataService.getMetadataInfosByCodes(query);
  }

  @HttpProcessor.handle('导出元数据列表')
  @Permissions(PERMISSION_CODE.METADATA_SEARCH)
  @Get('/export')
  public async exportExcel(
    @Res() res: Response,
    @QueryList(new ParsePageQueryIntPipe(['projectId', 'status', 'operatorType']))
    query: QueryListQuery<QueryMetadataListDto>
  ): Promise<void> {
    const [stream, length] = await this.metadataService.exportExcel(query);
    res.set({
      'Content-Type': 'application/xlsx',
      'Content-Length': length
    });
    res.attachment(`元数据 ${moment().format('lll')}.xlsx`);
    stream.pipe(res);
  }

  @HttpProcessor.handle('获取tag列表')
  @Permissions(PERMISSION_CODE.METADATA_SEARCH)
  @Get('/tag')
  getMetadataTags(
    @QueryList(new ParsePageQueryIntPipe(['projectId']))
    query: QueryListQuery<QueryMetadataTagListDto>
  ): Promise<PageData<MetadataTagModel>> {
    return this.metadataService.getMetadataTags(query);
  }

  @HttpProcessor.handle('获取事件属性')
  @Permissions(PERMISSION_CODE.METADATA_SEARCH)
  @Get('/fields')
  getEventAttrs(@Query() query: GetEventAttrDto): Promise<ListData<EventAttrsListDto>> {
    return this.metadataService.getFieldList(query);
  }

  @HttpProcessor.handle('新增标签')
  @Post('/tag')
  @Permissions(PERMISSION_CODE.METADATA_ADD)
  addMetadataTag(@Body() body: AddMetadataTagDto): Promise<void> {
    return this.metadataService.addMetadataTag(body);
  }

  @HttpProcessor.handle('更新标签')
  @Put('/tag')
  @Permissions(PERMISSION_CODE.METADATA_UPDATE)
  updateMetadataTag(@Body() body: UpdateMetadataTagDto): Promise<void> {
    return this.metadataService.updateMetadataTag(body);
  }

  @HttpProcessor.handle('删除标签')
  @Delete('/tag')
  @Permissions(PERMISSION_CODE.METADATA_UPDATE)
  deleteMetadataTag(@Query('tagId', new ParseIntPipe()) tagId: number): Promise<void> {
    return this.metadataService.deleteMetadataTag(tagId);
  }
}
