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
  Render,
} from '@nestjs/common';
import { MetadataModel, FieldModel, MetadataTagModel } from './metadata.model';
import { MetadataService } from './metadata.service';
import { HttpProcessor } from '@/decotators/http.decotator';
import { JwtAuthGuard } from '@/guards/auth.guard';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiUseTags,
  ApiResponse,
} from '@nestjs/swagger';
import { Permissions } from '@/decotators/permissions.decotators';
import { PermissionsGuard } from '@/guards/permission.guard';
import {
  QueryMetadataListDto,
  UpdateMetadataDto,
  AddMetadataTagDto,
  AddMetadataDto,
  QueryFieldListDto,
  QueryMetadataTagListDto,
} from './metadata.dto';

@ApiUseTags('元数据')
@Controller('metadata')
// @UseGuards(JwtAuthGuard)
export class MetadataController {
  constructor(private readonly metadataService: MetadataService) {}

  @HttpProcessor.handle('新增元数据')
  @Post('/')
  @UseGuards(JwtAuthGuard)
  addMetadata(@Body() body: AddMetadataDto): Promise<void> {
    return this.metadataService.addMetadata(body);
  }

  @HttpProcessor.handle('获取元数据列表')
  // @UseGuards(JwtAuthGuard)
  @Get('/')
  getMetadatas(
    @QueryList(new ParsePageQueryIntPipe(['projectId', 'status']))
    query: QueryListQuery<QueryMetadataListDto>,
  ): Promise<PageData<MetadataModel>> {
    return this.metadataService.getMetadatas(query);
  }
  @HttpProcessor.handle('获取元数据列表')
  // @UseGuards(JwtAuthGuard)
  @Get('/fields')
  getFields(
    @QueryList(new ParsePageQueryIntPipe(['projectId', 'status', 'type']))
    query: QueryListQuery<QueryFieldListDto>,
  ): Promise<PageData<FieldModel>> {
    return this.metadataService.getFields(query);
  }

  @Get('/active-fields')
  getActiveFields(
    @Query()
    query: any,
  ): Promise<FieldModel> {
    return this.metadataService.getActiveFields(query);
  }

  @HttpProcessor.handle('新增标签')
  @Post('/tag')
  @UseGuards(JwtAuthGuard)
  addMetadataTag(@Body() body: AddMetadataTagDto): Promise<void> {
    return this.metadataService.addMetadataTag(body);
  }

  @HttpProcessor.handle('获取tag列表')
  @UseGuards(JwtAuthGuard)
  @Get('/tag')
  getMetadataTags(
    @QueryList(new ParsePageQueryIntPipe(['projectId']))
    query: QueryListQuery<QueryMetadataTagListDto>,
  ): Promise<PageData<MetadataTagModel>> {
    return this.metadataService.getMetadataTags(query);
  }

  // @HttpProcessor.handle('获取元数据信息')
  // @Get('/info')
  // @UseGuards(JwtAuthGuard)
  // getMetadataInfo(
  //   @Query('metadataId') metadataId: string,
  // ): Promise<MetadataModel> {
  //   return this.metadataService.getMetadataById(metadataId);
  // }

  // @HttpProcessor.handle('获取元数据列表')
  // // @UseGuards(JwtAuthGuard)
  // @Get('/')
  // getMetadatas(
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
  //   query: QueryListQuery<QueryMetadataListDto>,
  // ): Promise<PageData<MetadataModel>> {
  //   return this.metadataService.getMetadatas(query);
  // }

  // @HttpProcessor.handle('修改元数据')
  // @Put('/')
  // @UseGuards(JwtAuthGuard)
  // updateMetadata(@Body() body: UpdateMetadataDto): Promise<void> {
  //   return this.metadataService.updateMetadata(body);
  // }
}
