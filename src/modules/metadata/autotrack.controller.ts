import { QueryAutotrackListDto } from './autotrack.dto';
import { ParsePageQueryIntPipe } from './../../pipes/parse-page-query-int.pipe';
import { QueryList } from './../../decotators/query-list.decorators';
import { UserModel } from './../user/user.model';
import { Auth } from './../../decotators/user.decorators';
import { AutotrackModel } from './autotrack.model';
import { PageData, QueryListQuery } from './../../interfaces/request.interface';
import { PermissionsGuard } from '@/guards/permission.guard';

import { Controller, Get, UseGuards, Query } from '@nestjs/common';

import { AutotrackService } from './autotrack.service';
import { HttpProcessor } from '@/decotators/http.decotator';
import { JwtAuthGuard } from '@/guards/auth.guard';
import { ApiUseTags } from '@nestjs/swagger';

@ApiUseTags('枚举值')
@Controller('autotrack')
@UseGuards(JwtAuthGuard, PermissionsGuard)
export class AutotrackController {
  constructor(private readonly autotrackService: AutotrackService) {}

  @HttpProcessor.handle('获取圈选数据列表')
  @Get('/')
  getAutotrackList(
    @QueryList(new ParsePageQueryIntPipe(['projectId']))
    query: QueryListQuery<QueryAutotrackListDto>,
    @Auth() user: UserModel
  ): Promise<PageData<AutotrackModel>> {
    return this.autotrackService.getAutotrackList(query, user);
  }
}
