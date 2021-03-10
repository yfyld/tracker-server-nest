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
import {
  ModuleModel
  //  FieldModel, MetadataTagModel
} from './module.model';
import { ModuleService } from './module.service';
import { HttpProcessor } from '@/decotators/http.decotator';
import { JwtAuthGuard } from '@/guards/auth.guard';
import { ApiBearerAuth, ApiOperation, ApiUseTags, ApiResponse } from '@nestjs/swagger';
import { AddModuleDto, ModuleListItemDto, ModuleListReqDto } from './module.dto';
import { XlsxService } from '@/providers/xlsx/xlsx.service';
import { Permissions } from '@/decotators/permissions.decotators';
import { Response } from 'express';
import { Auth } from '@/decotators/user.decorators';

@ApiUseTags('模块')
@Controller('module')
@UseGuards(JwtAuthGuard, PermissionsGuard)
export class ModuleController {
  constructor(private readonly moduleService: ModuleService) {}

  @HttpProcessor.handle('获取模块列表')
  @Permissions(PERMISSION_CODE.MODULE_SEARCH)
  @Get('/')
  getModuleList(
    @QueryList(new ParsePageQueryIntPipe([]))
    query: QueryListQuery<ModuleListReqDto>,
    @Auth() user: UserModel
  ): Promise<PageData<ModuleModel>> {
    return this.moduleService.getModuleList(query);
  }

  @HttpProcessor.handle('新增模块')
  @Post('/')
  // @Permissions(PERMISSION_CODE.MODULE_ADD)
  addModule(@Body() body: AddModuleDto): Promise<void> {
    console.log('addModuleaddModule', body);
    return this.moduleService.addModule(body);
  }

  // @HttpProcessor.handle('更新模块')
  // @Put('/')
  // @Permissions(PERMISSION_CODE.MODULE_UPDATE)
  // updateModule(@Body() body: UpdateModuleDto): Promise<void> {
  //   return this.moduleService.updateModule(body);
  // }

  // @HttpProcessor.handle('删除模块')
  // @Delete('/:moduleId')
  // @Permissions(PERMISSION_CODE.MODULE_DEL)
  // deleteModule(@Param('moduleId', new ParseIntPipe()) moduleID: number): Promise<void> {
  //   return this.moduleService.deleteMetadata(moduleID);
  // }

  // @HttpProcessor.handle('导出模块列表')
  // @Permissions(PERMISSION_CODE.MODULE_SEARCH)
  // @Get('/export')
  // public async exportExcel(
  //   @Res() res: Response,
  //   @QueryList(new ParsePageQueryIntPipe(['projectId', 'status', 'operatorType']))
  //   query: QueryListQuery<QueryModuleListDto>
  // ): Promise<void> {
  //   const [stream, length] = await this.moduleService.exportExcel(query);
  //   res.set({
  //     'Content-Type': 'application/xlsx',
  //     'Content-Length': length
  //   });
  //   res.attachment('module.xlsx');
  //   stream.pipe(res);
  // }

  // @HttpProcessor.handle('更新元数据日志数据')
  // @Put('/log')
  // @Permissions(PERMISSION_CODE.METADATA_UPDATE)
  // updateMetadataLog(@Body() body: UpdateMetadataLogDto): Promise<void> {
  //   return this.metadataService.updateMetadataLog(body);
  // }

  // @HttpProcessor.handle('批量更新元数据')
  // @Post('/batch')
  // @Transaction()
  // @Permissions(PERMISSION_CODE.METADATA_UPDATE)
  // updateMetadataBatch(
  //   @Body() body: UpdateMetadataBatchDto,
  //   @TransactionManager() manager: EntityManager
  // ): Promise<void> {
  //   return this.metadataService.updateMetadataBatch(body, manager);
  // }

  // @HttpProcessor.handle('启用元数据')
  // @Put('/enable/:projectId/:metadataId')
  // @Permissions(PERMISSION_CODE.METADATA_ENABLE)
  // enableMetadata(@Param('metadataId', new ParseIntPipe()) metadataId: number): Promise<void> {
  //   return this.metadataService.enableMetadata(metadataId);
  // }

  // @HttpProcessor.handle('停用元数据')
  // @Put('/disable/:projectId/:metadataId')
  // @Permissions(PERMISSION_CODE.METADATA_DISABLE)
  // disableMetadata(@Param('metadataId', new ParseIntPipe()) metadataId: number): Promise<void> {
  //   return this.metadataService.disableMetadata(metadataId);
  // }

  // @HttpProcessor.handle('获取tag列表')
  // @Permissions(PERMISSION_CODE.METADATA_SEARCH)
  // @Get('/tag')
  // getMetadataTags(
  //   @QueryList(new ParsePageQueryIntPipe(['projectId']))
  //   query: QueryListQuery<QueryMetadataTagListDto>
  // ): Promise<PageData<MetadataTagModel>> {
  //   return this.metadataService.getMetadataTags(query);
  // }

  // @HttpProcessor.handle('获取事件属性')
  // @Permissions(PERMISSION_CODE.METADATA_SEARCH)
  // @Get('/fields')
  // getEventAttrs(@Query() query: GetEventAttrDto): Promise<ListData<EventAttrsListDto>> {
  //   return this.metadataService.getFieldList(query);
  // }

  // @HttpProcessor.handle('新增标签')
  // @Post('/tag')
  // @Permissions(PERMISSION_CODE.METADATA_ADD)
  // addMetadataTag(@Body() body: AddMetadataTagDto): Promise<void> {
  //   return this.metadataService.addMetadataTag(body);
  // }

  // @HttpProcessor.handle('更新标签')
  // @Put('/tag')
  // @Permissions(PERMISSION_CODE.METADATA_UPDATE)
  // updateMetadataTag(@Body() body: UpdateMetadataTagDto): Promise<void> {
  //   return this.metadataService.updateMetadataTag(body);
  // }

  // @HttpProcessor.handle('删除标签')
  // @Delete('/tag/:projectId/:tagId')
  // @Permissions(PERMISSION_CODE.METADATA_UPDATE)
  // deleteMetadataTag(@Param('tagId', new ParseIntPipe()) tagId: number): Promise<void> {
  //   return this.metadataService.deleteMetadataTag(tagId);
  // }
}
