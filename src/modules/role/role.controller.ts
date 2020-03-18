import { ApiBearerAuth, ApiOperation, ApiResponse, ApiUseTags } from '@nestjs/swagger';
import { Controller, UseGuards, Post, Get, Body, Query, Put, Param, Delete, ParseIntPipe } from '@nestjs/common';
import { JwtAuthGuard } from '@/guards/auth.guard';
import { RoleService } from '@/modules/role/role.service';
import {
  BaseRoleDto,
  RoleItemDto,
  QueryRoleDto,
  UpdateRoleDto, RolePermission, UpdateRolePermissions
} from '@/modules/role/role.dto';
import { HttpProcessor } from '@/decotators/http.decotator';
import { UserModel } from '@/modules/user/user.model';
import { Auth } from '@/decotators/user.decorators';
import { PageData, QueryListQuery } from '@/interfaces/request.interface';
import { QueryList } from '@/decotators/query-list.decorators';

@ApiUseTags('角色管理')
@Controller('role')
@UseGuards(JwtAuthGuard)
export class RoleController {
  constructor(private readonly roleService: RoleService) {}

  @ApiOperation({ title: '新建角色', description: '' })
  @ApiResponse({ status: 200, type: RoleItemDto})
  @Post('/')
  @HttpProcessor.handle({ message: '新建角色' })
  @UseGuards(JwtAuthGuard)
  addRole(@Auth() user: UserModel, @Body() body: BaseRoleDto): Promise<RoleItemDto> {
    return this.roleService.addRole(user, body);
  }

  @ApiOperation({ title: '获取角色列表', description: '' })
  @ApiBearerAuth()
  @HttpProcessor.handle('获取角色列表')
  @UseGuards(JwtAuthGuard)
  @Get('/')
  getRoles(@QueryList() query: QueryListQuery<QueryRoleDto>): Promise<PageData<RoleItemDto>> {
    return this.roleService.getRoles(query);
  }

  @ApiOperation({ title: '编辑角色', description: '' })
  @HttpProcessor.handle('编辑角色')
  @Put('/')
  @UseGuards(JwtAuthGuard)
  updateRole(@Auth() user: UserModel, @Body() body: UpdateRoleDto): Promise<void> {
    return this.roleService.updateRole(user, body);
  }

  @ApiOperation({ title: '删除角色', description: '' })
  @HttpProcessor.handle('删除角色')
  @Delete('/:roleId')
  @UseGuards(JwtAuthGuard)
  deleteRole(@Auth() user: UserModel, @Param('roleId', new ParseIntPipe()) roleId: number): Promise<void> {
    return this.roleService.deleteRole(user, roleId);
  }

  @ApiOperation({ title: '获取角色对应权限列表', description: '' })
  @HttpProcessor.handle('获取角色对应权限列表')
  @Get('/rolePermissions/:roleId')
  @UseGuards(JwtAuthGuard)
  getRolePermissions(@Auth() user: UserModel, @Param('roleId', new ParseIntPipe()) roleId: number): Promise<RolePermission[]> {
    return this.roleService.getRolePermissions(roleId);
  }

  @ApiOperation({ title: '更新角色下所有权限', description: '' })
  @HttpProcessor.handle('更新角色下所有权限')
  @Put('/rolePermissions')
  @UseGuards(JwtAuthGuard)
  updateRolePermissions(@Auth() user: UserModel, @Body() body: UpdateRolePermissions): Promise<void> {
    return this.roleService.updateRolePermissions(user, body.roleId, body.permissionIds);
  }
}