import { PERMISSION_CODE } from '../../constants/permission.contant';
import { PermissionsGuard } from '@/guards/permission.guard';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiUseTags } from '@nestjs/swagger';
import { Controller, UseGuards, Post, Get, Body, Query, Put, Param, Delete, ParseIntPipe } from '@nestjs/common';
import { JwtAuthGuard } from '@/guards/auth.guard';
import { PermissionListItemDto, QueryPermissionDto } from '@/modules/permission/permission.dto';
import { HttpProcessor } from '@/decotators/http.decotator';
import { PageData, QueryListQuery } from '@/interfaces/request.interface';
import { QueryList } from '@/decotators/query-list.decorators';
import { Permissions } from '@/decotators/permissions.decotators';
import { AppIdInsertDto, AppIdListDto } from './appId.dto';
import { AppIdService } from './appId.service';

@ApiUseTags('appId')
@Controller('appId')
@UseGuards(JwtAuthGuard, PermissionsGuard)
export class AppIdController {
  constructor(private readonly appIdService: AppIdService) {}

  @ApiOperation({ title: '新增appId', description: '' })
  // @ApiBearerAuth()
  @HttpProcessor.handle('新增appId')
  // @Permissions(PERMISSION_CODE)
  @Post('/')
  add(@Body() body: AppIdInsertDto): Promise<void> {
    return this.appIdService.insert(body);
  }

  @ApiOperation({ title: '获取AppId列表', description: '' })
  @ApiBearerAuth()
  @HttpProcessor.handle('获取AppId列表')
  // @Permissions(PERMISSION_CODE.PERMISSION_SEARCH)
  @Get('/')
  getPermissions(@QueryList() query: QueryListQuery<AppIdListDto>): Promise<PageData<AppIdInsertDto>> {
    return this.appIdService.getList(query);
  }
}
