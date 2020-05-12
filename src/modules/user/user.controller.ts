import { QueryList } from '@/decotators/query-list.decorators';
import { Auth } from '@/decotators/user.decorators';
import {
  Controller,
  Get,
  Post,
  Body,
  UseGuards,
  Put,
  ClassSerializerInterceptor,
  Param,
  ParseIntPipe,
  Delete
} from '@nestjs/common';
import { UserModel } from './user.model';
import { UserService } from './user.service';
import { HttpProcessor } from '@/decotators/http.decotator';
import { JwtAuthGuard } from '@/guards/auth.guard';
import { ApiBearerAuth, ApiUseTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import {
  UserListReqDto,
  UpdateUserDto,
  UserListItemDto,
  BaseUserDto,
  UpdateUserRoles,
  UpdateUserByAdminDto
} from './user.dto';
import { QueryListQuery, PageData } from '@/interfaces/request.interface';
import { UseInterceptors } from '@nestjs/common';
import { AuthService } from '../auth/auth.service';
import { TokenDto, SignUpDto } from '../auth/auth.dto';
import { RolePermission, UpdateRolePermissions } from '@/modules/role/role.dto';

@ApiUseTags('账号权限')
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  // 检测 Token 有效性
  @ApiOperation({ title: '检测 Token', description: '' })
  @Post('check')
  @HttpProcessor.handle('检测 Token')
  checkToken(): string {
    return 'ok';
  }

  @ApiOperation({ title: '修改用户信息', description: '' })
  @HttpProcessor.handle('修改用户信息')
  @UseGuards(JwtAuthGuard)
  @Put('/')
  updateUser(@Auth() user: UserModel, @Body() { mobile, nickname, email, id }: UpdateUserDto): Promise<void> {
    if (id !== user.id) {
      throw '非法修改';
    }
    return this.userService.updateUser({ mobile, nickname, email, id });
  }

  @ApiOperation({ title: '修改指定用户信息', description: '' })
  @HttpProcessor.handle('修改指定用户信息')
  @UseGuards(JwtAuthGuard)
  @Put('/admin-update')
  updateUserById(@Auth() user: UserModel, @Body() body: UpdateUserByAdminDto): Promise<void> {
    //todo 判断下是否是超管
    return this.userService.updateUserByAdmin(body);
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @ApiOperation({ title: '获取当前登录用户信息', description: '' })
  @ApiBearerAuth()
  @ApiResponse({ status: 200, type: UserModel })
  @HttpProcessor.handle('获取当前登录用户信息')
  @Get('/info')
  @UseGuards(JwtAuthGuard)
  getUserInfo(@Auth() user: UserModel): Promise<BaseUserDto> {
    return this.userService.getUserBaseInfoById(user.id);
  }

  @ApiOperation({ title: '获取用户列表', description: '' })
  @ApiResponse({ status: 200, type: UserModel })
  @HttpProcessor.handle('获取用户列表')
  @UseGuards(JwtAuthGuard)
  @Get('/')
  getUsers(
    @Auth() user: UserModel,
    @QueryList() query: QueryListQuery<UserListReqDto>
  ): Promise<PageData<UserListItemDto>> {
    return this.userService.getUsers(user, query);
  }

  @ApiOperation({ title: '删除用户', description: '' })
  @HttpProcessor.handle('删除用户')
  @Delete('/:userId')
  @UseGuards(JwtAuthGuard)
  deletePermission(@Auth() user: UserModel, @Param('userId', new ParseIntPipe()) userId: number): Promise<void> {
    return this.userService.deleteUserById(user, userId);
  }
}
