import { Response } from 'express';
import { PermissionsGuard } from '@/guards/permission.guard';

import { Controller, Get, Post, Body, UseGuards, Delete, Param, Put, Res, Headers, Query } from '@nestjs/common';

import { CheckoutService } from './checkout.service';
import { HttpProcessor } from '@/decotators/http.decotator';
import { JwtAuthGuard } from '@/guards/auth.guard';
import { ApiBearerAuth, ApiOperation, ApiUseTags } from '@nestjs/swagger';

import * as moment from 'moment';

import { Permissions } from '@/decotators/permissions.decotators';
import { Auth } from '@/decotators/user.decorators';
import { PERMISSION_CODE } from '@/constants/permission.contant';
import { AddCheckoutLogDto, UpdateCheckoutLogDto } from './checkout.dto';
import { UserModel } from '../user/user.model';
import { Cookie } from '@/decotators/cookie.decorators';

moment.locale('zh-cn');
@Controller('checkout')
export class CheckoutController {
  constructor(private readonly checkoutService: CheckoutService) {}
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @HttpProcessor.handle('新增校验日志')
  @Post('/add-log')
  addCheckoutLog(@Body() body: AddCheckoutLogDto, @Auth() user: UserModel): Promise<void> {
    return this.checkoutService.addCheckoutLog(body, user);
  }
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @HttpProcessor.handle('修改校验日志')
  @Post('/add-log')
  updateCheckoutLog(@Body() body: UpdateCheckoutLogDto, @Auth() user: UserModel): Promise<void> {
    return this.checkoutService.updateCheckoutLog(body, user);
  }

  @HttpProcessor.handle('用户标识')
  @Get('/user')
  getUserInfo(@Cookie() cookie): any {
    return {
      uid: cookie['user_id'] || cookie['wechat_uid'],
      deviceId: cookie['TRYCATCH_TOKEN']
    };
  }

  @HttpProcessor.handle('导出记录')
  @Get('/export')
  async getCheckoutRecord(@Res() res: Response, @Query('version') version: string): Promise<any> {
    const [stream, length] = await this.checkoutService.getCheckoutRecord(version);
    res.set({
      'Content-Type': 'application/xlsx',
      'Content-Length': length
    });
    res.attachment(`埋点${version}版本的测试记录 ${moment().format('lll')}.xlsx`);
    stream.pipe(res);
  }
}
