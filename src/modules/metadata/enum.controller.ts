import { PermissionsGuard } from '@/guards/permission.guard';

import { Controller, Get, UseGuards, Query } from '@nestjs/common';

import { EnumService } from './enum.service';
import { HttpProcessor } from '@/decotators/http.decotator';
import { JwtAuthGuard } from '@/guards/auth.guard';
import { ApiUseTags } from '@nestjs/swagger';

@ApiUseTags('枚举值')
@Controller('enum')
@UseGuards(JwtAuthGuard, PermissionsGuard)
export class EnumController {
  constructor(private readonly enumService: EnumService) {}

  @HttpProcessor.handle('获取枚举值')
  @Get('/')
  getEnumList(
    @Query('code') code: string
  ): Promise<
    {
      label: string;
      value: string;
    }[]
  > {
    return this.enumService.getEnumList(code);
  }
}
