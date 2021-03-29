import { UserModel } from './../user/user.model';
import { TransactionManager, EntityManager, Transaction } from 'typeorm';
import { PERMISSION_CODE } from './../../constants/permission.contant';
import { PermissionsGuard } from '@/guards/permission.guard';
import { ParsePageQueryIntPipe } from '../../pipes/parse-page-query-int.pipe';
import { ParseIntPipe } from './../../pipes/parse-int.pipe';
import { Response } from 'express';
import { QueryListQuery, ListData } from '@/interfaces/request.interface';
import { QueryList } from '../../decotators/query-list.decorators';
import { PageData } from '../../interfaces/request.interface';
import { Controller, Get, Post, Body, UseGuards, Delete, Param, Put, Res } from '@nestjs/common';
import {
  ModuleModel
  //  FieldModel, MetadataTagModel
} from './module.model';
import { ModuleService } from './module.service';
import { HttpProcessor } from '@/decotators/http.decotator';
import { JwtAuthGuard } from '@/guards/auth.guard';
import { ApiBearerAuth, ApiOperation, ApiUseTags, ApiResponse } from '@nestjs/swagger';
import {
  AddModuleDto,
  ModuleListItemDto,
  ModuleListReqDto,
  ModuleTypesItemDto,
  QueryModuleListDto,
  UpdateModuleDto
} from './module.dto';
import * as moment from 'moment';
moment.locale('zh-cn');
import { Permissions } from '@/decotators/permissions.decotators';
import { Auth } from '@/decotators/user.decorators';
import { MetadataService } from '../metadata/metadata.service';

@ApiUseTags('module')
@Controller('module')
@UseGuards(JwtAuthGuard, PermissionsGuard)
export class ModuleController {
  constructor(private readonly moduleService: ModuleService, private readonly metadataService: MetadataService) {}

  @ApiOperation({ title: '新增模块', description: '' })
  @HttpProcessor.handle('新增模块')
  @Post('/')
  @Permissions(PERMISSION_CODE.MODULE_ADD)
  addModule(@Body() body: AddModuleDto): Promise<void> {
    return this.moduleService.addModule(body);
  }

  @ApiOperation({ title: '获取模块种类', description: '' })
  @HttpProcessor.handle('获取模块列表')
  @Permissions(PERMISSION_CODE.MODULE_OPITONS)
  @Get('/moduletypes')
  getModuleTypes() {
    return this.moduleService.getModuleTypes();
  }

  @ApiOperation({ title: '获取模块列表', description: '' })
  @HttpProcessor.handle('获取模块列表')
  @Permissions(PERMISSION_CODE.MODULE_SEARCH)
  @Get('/')
  getModuleList(
    @QueryList()
    query: QueryListQuery<ModuleListReqDto>
  ): Promise<PageData<ModuleListItemDto>> {
    return this.moduleService.getModuleList(query);
  }

  @ApiOperation({ title: '删除模块', description: '' })
  @HttpProcessor.handle('删除模块')
  @Permissions(PERMISSION_CODE.MODULE_DEL)
  @Delete('/:moduleId')
  async deleteModule(@Param('moduleId', new ParseIntPipe()) moduleId: number): Promise<void> {
    const metaData = await this.metadataService.isMetaDataAssocited(moduleId);
    if (!metaData) {
      return this.moduleService.deleteModule(moduleId);
    }
  }

  @ApiOperation({ title: '是否关联元数据', description: '' })
  @HttpProcessor.handle('是否关联元数据')
  @Permissions(PERMISSION_CODE.MODULE_DEL)
  @Delete('/relationMetaData/:moduleId')
  async isMetaDataAssocited(@Param('moduleId', new ParseIntPipe()) moduleId: number): Promise<Boolean> {
    const metaData = await this.metadataService.isMetaDataAssocited(moduleId);
    return new Boolean(metaData);
  }

  @ApiOperation({ title: '修改模块', description: '' })
  @HttpProcessor.handle('修改模块')
  @Put('/')
  @Permissions(PERMISSION_CODE.MODULE_UPDATE)
  updateModule(@Body() body: UpdateModuleDto): Promise<void> {
    return this.moduleService.updateModule(body);
  }

  @HttpProcessor.handle('导出模块列表')
  @Permissions(PERMISSION_CODE.MODULE_EXPORT)
  @Get('/export')
  public async exportExcel(
    @Res() res: Response,
    @QueryList()
    query: QueryListQuery<QueryModuleListDto>
  ): Promise<void> {
    const [stream, length] = await this.moduleService.exportExcel(query);
    res.set({
      'Content-Type': 'application/xlsx',
      'Content-Length': length
    });
    res.attachment(`模块 ${moment().format('lll')}.xlsx`);
    stream.pipe(res);
  }
}
