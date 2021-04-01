import { PermissionsGuard } from '@/guards/permission.guard';

import { Controller, Get, Post, Body, UseGuards, Delete, Param, Put, Res } from '@nestjs/common';

import { CheckoutService } from './checkout.service';
import { HttpProcessor } from '@/decotators/http.decotator';
import { JwtAuthGuard } from '@/guards/auth.guard';
import { ApiBearerAuth, ApiOperation, ApiUseTags, ApiResponse } from '@nestjs/swagger';

import * as moment from 'moment';

import { Permissions } from '@/decotators/permissions.decotators';
import { Auth } from '@/decotators/user.decorators';
import { PERMISSION_CODE } from '@/constants/permission.contant';
import { AddCheckoutLogDto, UpdateCheckoutLogDto } from './checkout.dto';
import { UserModel } from '../user/user.model';
import { Cookie } from '@/../dist/decotators/cookie.decorators';
moment.locale('zh-cn');
@Controller('checkout')
@UseGuards(JwtAuthGuard, PermissionsGuard)
export class CheckoutController {
  constructor(private readonly checkoutService: CheckoutService) {}

  @HttpProcessor.handle('新增校验日志')
  @Post('/add-log')
  addCheckoutLog(@Body() body: AddCheckoutLogDto, @Auth() user: UserModel): Promise<void> {
    return this.checkoutService.addCheckoutLog(body, user);
  }

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
}
