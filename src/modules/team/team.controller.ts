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
import { QueryTeamListDto, UpdateTeamDto, AddTeamDto, QueryFieldListDto } from './team.dto';
import { Auth } from '@/decotators/user.decorators';

@ApiUseTags('报告单')
@Controller('team')
// @UseGuards(JwtAuthGuard)
export class TeamController {
  constructor(private readonly teamService: TeamService) {}

  @HttpProcessor.handle('新增报告单')
  @Post('/')
  @UseGuards(JwtAuthGuard)
  addTeam(@Body() body: AddTeamDto, @Auth() user): Promise<void> {
    return this.teamService.addTeam(body, user);
  }

  @HttpProcessor.handle('获取报告单列表')
  @UseGuards(JwtAuthGuard)
  @Get('/')
  getTeams(
    @QueryList(new ParsePageQueryIntPipe(['projectId', 'status']))
    query: QueryListQuery<QueryTeamListDto>
  ): Promise<PageData<TeamModel>> {
    return this.teamService.getTeams(query);
  }

  @HttpProcessor.handle('删除报告单')
  @Delete('/:teamId')
  @UseGuards(JwtAuthGuard)
  updateTeam(@Param('teamId') teamId: number): Promise<void> {
    return this.teamService.deleteTeam(teamId);
  }

  // @HttpProcessor.handle('获取报告单信息')
  // @Get('/info')
  // @UseGuards(JwtAuthGuard)
  // getTeamInfo(
  //   @Query('teamId') teamId: string,
  // ): Promise<TeamModel> {
  //   return this.teamService.getTeamById(teamId);
  // }

  // @HttpProcessor.handle('获取报告单列表')
  // // @UseGuards(JwtAuthGuard)
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

  // @HttpProcessor.handle('修改报告单')
  // @Put('/')
  // @UseGuards(JwtAuthGuard)
  // updateTeam(@Body() body: UpdateTeamDto): Promise<void> {
  //   return this.teamService.updateTeam(body);
  // }
}
