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

  @HttpProcessor.handle('获取枚举值')
  @Get('/')
  getAutotrackList(
    @Query('code') code: string
  ): Promise<
    {
      label: string;
      value: string;
    }[]
  > {
    return this.autotrackService.getAutotrackList(code);
  }
}
