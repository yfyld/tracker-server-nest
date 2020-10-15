import { PERMISSION_CODE } from './../../constants/permission.contant';
import { TransactionManager, EntityManager, Transaction } from 'typeorm';
import { ParseIntPipe } from './../../pipes/parse-int.pipe';
import { QueryListQuery } from '@/interfaces/request.interface';
import { QueryList } from './../../decotators/query-list.decorators';
import { PageQuery, PageData } from './../../interfaces/request.interface';
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
  UseInterceptors,
  ClassSerializerInterceptor
} from '@nestjs/common';
import { ProjectModel } from './project.model';
import { ProjectService } from './project.service';
import { HttpProcessor } from '@/decotators/http.decotator';
import { JwtAuthGuard } from '@/guards/auth.guard';
import { ApiBearerAuth, ApiOperation, ApiUseTags, ApiResponse } from '@nestjs/swagger';
import { Permissions } from '@/decotators/permissions.decotators';
import { PermissionsGuard } from '@/guards/permission.guard';
import {
  ProjectDto,
  AddProjectDto,
  AddMembersDto,
  DeleteMembersDto,
  UpdateMembersDto,
  QueryProjectsDto,
  UpdateProjectDto,
  AddProjectResDto,
  AddSourcemapsDto,
  ActionSourcemapsDto
} from './project.dto';
import { Auth } from '@/decotators/user.decorators';
import { UserModel } from '@/modules/user/user.model';

@ApiUseTags('应用相关')
@Controller('project')
@UseGuards(JwtAuthGuard, PermissionsGuard)
export class ProjectController {
  constructor(private readonly projectService: ProjectService) {}

  @ApiOperation({ title: '新建应用', description: '' })
  @ApiResponse({ status: 200, type: ProjectDto })
  @Post('/')
  @HttpProcessor.handle({ message: '新建应用' })
  @Permissions(PERMISSION_CODE.PROJECT_ADD)
  addProject(@Body() body: AddProjectDto, @Auth() user: UserModel): Promise<AddProjectResDto> {
    return this.projectService.addProject(body, user);
  }

  @ApiOperation({ title: '编辑应用', description: '' })
  @HttpProcessor.handle('编辑应用')
  @Put('/')
  @Permissions(PERMISSION_CODE.PROJECT_UPDATE)
  updateProject(@Body() body: UpdateProjectDto): Promise<void> {
    return this.projectService.updateProject(body);
  }

  @ApiOperation({ title: '删除应用', description: '' })
  @HttpProcessor.handle('删除应用')
  @Delete('/:projectId')
  @Permissions(PERMISSION_CODE.PROJECT_DEL)
  deleteProject(@Param('projectId', new ParseIntPipe()) projectId: number): Promise<void> {
    return this.projectService.deleteProject(projectId);
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @ApiOperation({ title: '获取应用信息', description: '' })
  @ApiBearerAuth()
  @ApiResponse({ status: 200, type: ProjectModel })
  @HttpProcessor.handle('获取应用信息')
  @Get('/info')
  @Permissions(PERMISSION_CODE.PROJECT_INFO)
  getProjectInfo(@Query('projectId', new ParseIntPipe()) projectId: number): Promise<ProjectDto> {
    return this.projectService.getProjectInfo(projectId);
  }

  @ApiOperation({ title: '获取应用列表', description: '' })
  @ApiBearerAuth()
  @HttpProcessor.handle('获取应用列表')
  @Permissions(PERMISSION_CODE.PROJECT_SEARCH)
  @Get('/')
  getProjects(
    @Auth() user: UserModel,
    @QueryList() query: QueryListQuery<QueryProjectsDto>
  ): Promise<PageData<ProjectModel>> {
    return this.projectService.getProjects(user, query);
  }

  @ApiOperation({ title: '获取所有相关应用', description: '' })
  @ApiBearerAuth()
  @HttpProcessor.handle('获取所有相关应用')
  @Permissions(PERMISSION_CODE.PROJECT_SEARCH_ALL)
  @Get('/all')
  getMyProjects(@Auth() user: UserModel): Promise<PageData<ProjectModel>> {
    return this.projectService.getMyProjects(user);
  }

  @ApiOperation({ title: '添加成员', description: '' })
  @Post('/add-members')
  @HttpProcessor.handle({ message: '添加成员' })
  @Permissions(PERMISSION_CODE.PROJECT_MEMBER_ADD)
  addMembers(@Body() body: AddMembersDto): Promise<void> {
    return this.projectService.addMembers(body);
  }

  @ApiOperation({ title: '删除成员', description: '' })
  @Post('/delete-members')
  @HttpProcessor.handle({ message: '删除成员' })
  @Permissions(PERMISSION_CODE.PROJECT_MEMBER_DEL)
  deleteMember(@Body() body: DeleteMembersDto): Promise<void> {
    return this.projectService.deleteMember(body);
  }

  @ApiOperation({ title: '编辑成员', description: '' })
  @Post('/update-members')
  @Permissions(PERMISSION_CODE.PROJECT_MEMBER_UPDATE)
  @HttpProcessor.handle({ message: '编辑成员' })
  updateMember(@Body() body: UpdateMembersDto): Promise<void> {
    return this.projectService.updateMember(body);
  }
}
