import { PermissionsGuard } from '@/guards/permission.guard';
import { ParseIntPipe } from './../../pipes/parse-int.pipe';
import { Response } from 'express';
import { QueryListQuery, ListData } from '@/interfaces/request.interface';
import { QueryList } from '../../decotators/query-list.decorators';
import { PageData } from '../../interfaces/request.interface';
import { Controller, Get, Post, Body, UseGuards, Delete, Param, Put, Res } from '@nestjs/common';

import { ChannelService } from './channel.service';
import { HttpProcessor } from '@/decotators/http.decotator';
import { JwtAuthGuard } from '@/guards/auth.guard';
import { ApiBearerAuth, ApiOperation, ApiUseTags, ApiResponse } from '@nestjs/swagger';
import {
  AddChannelDto,
  ChannelListItemDto,
  ChannelListReqDto,
  QueryChannelListDto,
  UpdateChannelDto
} from './channel.dto';

import * as moment from 'moment';

import { Permissions } from '@/decotators/permissions.decotators';
import { Auth } from '@/decotators/user.decorators';
import { PERMISSION_CODE } from '@/constants/permission.contant';
moment.locale('zh-cn');
@ApiUseTags('channel')
@Controller('channel')
@UseGuards(JwtAuthGuard, PermissionsGuard)
export class ChannelController {
  constructor(private readonly channelService: ChannelService) {}

  @ApiOperation({ title: '新增渠道', description: '' })
  @HttpProcessor.handle('新增渠道')
  @Post('/')
  @Permissions(PERMISSION_CODE.CHANNEL_ADD)
  addChannel(@Body() body: AddChannelDto): Promise<void> {
    return this.channelService.addChannel(body);
  }

  @ApiOperation({ title: '获取渠道列表', description: '' })
  @HttpProcessor.handle('获取渠道列表')
  @Permissions(PERMISSION_CODE.CHANNEL_SEARCH)
  @Get('/')
  getChannelList(
    @QueryList()
    query: QueryListQuery<ChannelListReqDto>
  ): Promise<PageData<ChannelListItemDto>> {
    return this.channelService.getChannelList(query);
  }

  @ApiOperation({ title: '获取渠道列表,用于卡尔', description: '' })
  @HttpProcessor.handle('获取渠道列表')
  @Permissions(PERMISSION_CODE.CHANNEL_SEARCH)
  @Get('/all')
  getAllChannelList(
    @QueryList()
    query: QueryListQuery<ChannelListReqDto>
  ): Promise<PageData<ChannelListItemDto>> {
    return this.channelService.getChannelList(query);
  }

  @ApiOperation({ title: '删除渠道', description: '' })
  @HttpProcessor.handle('删除渠道')
  @Permissions(PERMISSION_CODE.CHANNEL_DELETE)
  @Delete('/:channelId')
  deleteChannel(@Param('channelId', new ParseIntPipe()) channelId: number): Promise<void> {
    return this.channelService.deleteChannel(channelId);
  }

  @ApiOperation({ title: '修改渠道', description: '' })
  @HttpProcessor.handle('修改渠道')
  @Put('/')
  @Permissions(PERMISSION_CODE.CHANNEL_UPDATE)
  updateChannel(@Body() body: UpdateChannelDto): Promise<void> {
    return this.channelService.updateChannel(body);
  }

  @HttpProcessor.handle('导出渠道列表')
  @Permissions(PERMISSION_CODE.CHANNEL_EXPORT)
  @Get('/export')
  public async exportExcel(
    @Res() res: Response,
    @QueryList()
    query: QueryListQuery<QueryChannelListDto>
  ): Promise<void> {
    const [stream, length] = await this.channelService.exportExcel(query);
    res.set({
      'Content-Type': 'application/xlsx',
      'Content-Length': length
    });
    res.attachment(`渠道 ${moment().format('lll')}.xlsx`);
    stream.pipe(res);
  }
}
