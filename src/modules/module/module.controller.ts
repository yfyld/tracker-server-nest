import { UserModel } from './../user/user.model';
import { TransactionManager, EntityManager, Transaction } from 'typeorm';
import { PERMISSION_CODE } from './../../constants/permission.contant';
import { PermissionsGuard } from '@/guards/permission.guard';
import { ParsePageQueryIntPipe } from '../../pipes/parse-page-query-int.pipe';
import { ParseIntPipe } from './../../pipes/parse-int.pipe';

import { QueryListQuery, ListData } from '@/interfaces/request.interface';
import { QueryList } from '../../decotators/query-list.decorators';
import { PageData } from '../../interfaces/request.interface';
import { Controller, Get, Post, Body, UseGuards } from '@nestjs/common';
import {
  ModuleModel
  //  FieldModel, MetadataTagModel
} from './module.model';
import { ModuleService } from './module.service';
import { HttpProcessor } from '@/decotators/http.decotator';
import { JwtAuthGuard } from '@/guards/auth.guard';
import { ApiBearerAuth, ApiOperation, ApiUseTags, ApiResponse } from '@nestjs/swagger';
import { AddModuleDto, ModuleListItemDto, ModuleListReqDto } from './module.dto';

import { Permissions } from '@/decotators/permissions.decotators';
import { Auth } from '@/decotators/user.decorators';

@ApiUseTags('module')
@Controller('module')
@UseGuards(JwtAuthGuard, PermissionsGuard)
export class ModuleController {
  constructor(private readonly moduleService: ModuleService) {}

  @ApiOperation({ title: '新增模块', description: '' })
  @HttpProcessor.handle('新增模块')
  @Post('/')
  // @Permissions(PERMISSION_CODE.MODULE_ADD)
  addModule(@Body() body: AddModuleDto): Promise<void> {
    console.log('222222', body);

    return;
    // return this.moduleService.addModule(body);
  }

  @ApiOperation({ title: '获取模块列表', description: '' })
  @HttpProcessor.handle('获取模块列表')
  @Permissions(PERMISSION_CODE.MODULE_SEARCH)
  @Get('/')
  getModuleList(
    @QueryList(new ParsePageQueryIntPipe([]))
    query: QueryListQuery<ModuleListReqDto>
  ): Promise<PageData<ModuleListItemDto>> {
    console.log('111111');
    return this.moduleService.getModuleList(query);
  }
}
