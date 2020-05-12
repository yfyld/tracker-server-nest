import { ApiBearerAuth, ApiOperation, ApiResponse, ApiUseTags } from '@nestjs/swagger';
import { Controller, UseGuards, Post, Get, Body, Query, Put, Param, Delete, ParseIntPipe } from '@nestjs/common';
import { JwtAuthGuard } from '@/guards/auth.guard';
import { PermissionService } from '@/modules/permission/permission.service';
import {
  BasePermissionDto,
  PermissionItemDto,
  PermissionListItemDto,
  QueryPermissionDto,
  UpdatePermissionDto
} from '@/modules/permission/permission.dto';
import { HttpProcessor } from '@/decotators/http.decotator';
import { UserModel } from '@/modules/user/user.model';
import { Auth } from '@/decotators/user.decorators';
import { PageData, QueryListQuery } from '@/interfaces/request.interface';
import { QueryList } from '@/decotators/query-list.decorators';

@ApiUseTags('权限管理')
@Controller('permission')
@UseGuards(JwtAuthGuard)
export class PermissionController {
  constructor(private readonly permissionService: PermissionService) {}

  @ApiOperation({ title: '新建权限', description: '' })
  @ApiResponse({ status: 200, type: PermissionListItemDto })
  @Post('/')
  @HttpProcessor.handle({ message: '新建权限' })
  @UseGuards(JwtAuthGuard)
  addPermission(@Auth() user: UserModel, @Body() body: BasePermissionDto): Promise<PermissionListItemDto> {
    return this.permissionService.addPermission(user, body);
  }

  @ApiOperation({ title: '获取权限列表', description: '' })
  @ApiBearerAuth()
  @HttpProcessor.handle('获取权限列表')
  @UseGuards(JwtAuthGuard)
  @Get('/')
  getPermissions(@QueryList() query: QueryListQuery<QueryPermissionDto>): Promise<PageData<PermissionListItemDto>> {
    return this.permissionService.getPermissions(query);
  }

  @ApiOperation({ title: '获取当前用户权限列表', description: '' })
  @ApiBearerAuth()
  @HttpProcessor.handle('获取当前用户权限列表')
  @UseGuards(JwtAuthGuard)
  @Get('/user')
  getPermissionsByUser(
    @Auth() user: UserModel,
    @QueryList() query: QueryListQuery<QueryPermissionDto>
  ): Promise<PageData<PermissionListItemDto>> {
    return this.permissionService.getPermissionsByUser(user, query);
  }

  @ApiOperation({ title: '编辑权限', description: '' })
  @HttpProcessor.handle('编辑权限')
  @Put('/')
  @UseGuards(JwtAuthGuard)
  updatePermission(@Auth() user: UserModel, @Body() body: UpdatePermissionDto): Promise<void> {
    return this.permissionService.updatePermission(user, body);
  }

  @ApiOperation({ title: '删除权限', description: '' })
  @HttpProcessor.handle('删除权限')
  @Delete('/:permissionId')
  @UseGuards(JwtAuthGuard)
  deletePermission(
    @Auth() user: UserModel,
    @Param('permissionId', new ParseIntPipe()) permissionId: number
  ): Promise<void> {
    return this.permissionService.deletePermission(user, permissionId);
  }
}
