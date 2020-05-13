import { PERMISSION_CODE } from './../../constants/permission.contant';
import { ParsePageQueryIntPipe } from '../../pipes/parse-page-query-int.pipe';

import { QueryListQuery } from '@/interfaces/request.interface';
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
  Render
} from '@nestjs/common';
import { TeamModel } from './team.model';
import { TeamService } from './team.service';
import { HttpProcessor } from '@/decotators/http.decotator';
import { JwtAuthGuard } from '@/guards/auth.guard';
import { ApiBearerAuth, ApiOperation, ApiUseTags, ApiResponse } from '@nestjs/swagger';
import { Permissions } from '@/decotators/permissions.decotators';
import { PermissionsGuard } from '@/guards/permission.guard';
import { QueryTeamListDto, UpdateTeamDto, AddTeamDto } from './team.dto';
import { Auth } from '@/decotators/user.decorators';
import { ParseIntPipe } from '@/pipes/parse-int.pipe';

@ApiUseTags('团队')
@Controller('team')
@UseGuards(JwtAuthGuard, PermissionsGuard)
export class TeamController {
  constructor(private readonly teamService: TeamService) {}

  @HttpProcessor.handle('新增团队')
  @Post('/')
  @Permissions(PERMISSION_CODE.TEAM_ADD)
  addTeam(@Body() body: AddTeamDto, @Auth() user): Promise<void> {
    return this.teamService.addTeam(body, user);
  }

  @HttpProcessor.handle('获取团队列表')
  @Permissions(PERMISSION_CODE.TEAM_SEARCH)
  @Get('/')
  getTeams(
    @QueryList(new ParsePageQueryIntPipe(['relevance']))
    query: QueryListQuery<QueryTeamListDto>,
    @Auth() user
  ): Promise<PageData<TeamModel>> {
    return this.teamService.getTeams(query, user);
  }

  @HttpProcessor.handle('删除团队')
  @Delete('/:teamId')
  @Permissions(PERMISSION_CODE.TEAM_DEL)
  deleteTeam(@Param('teamId') teamId: number): Promise<void> {
    return this.teamService.deleteTeam(teamId);
  }

  @HttpProcessor.handle('修改团队')
  @Put('/')
  @Permissions(PERMISSION_CODE.TEAM_UPDATE)
  updateTeam(@Body() body: UpdateTeamDto): Promise<void> {
    return this.teamService.updateTeam(body);
  }

  @HttpProcessor.handle('获取团队信息')
  @Get('/info')
  @Permissions(PERMISSION_CODE.TEAM_INFO)
  getTeamInfo(@Query('id', new ParseIntPipe()) id: number): Promise<TeamModel> {
    return this.teamService.getTeamById(id);
  }

  // @HttpProcessor.handle('获取团队列表')
  // // @Permissions(PERMISSION_CODE)
  // @Get('/')
  // getTeams(
  //   @QueryList(
  //     new ParsePageQueryIntPipe([
  //       'projectId',
  //       'endDate',
  //       'startDate',
  //       'level',
  //       'status',
  //       'guarder',
  //     ]),
  //   )
  //   query: QueryListQuery<QueryTeamListDto>,
  // ): Promise<PageData<TeamModel>> {
  //   return this.teamService.getTeams(query);
  // }
}
