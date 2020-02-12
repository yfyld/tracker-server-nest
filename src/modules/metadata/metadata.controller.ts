import { ParsePageQueryIntPipe } from '../../pipes/parse-page-query-int.pipe';
import { ParseIntPipe } from './../../pipes/parse-int.pipe';

import { QueryListQuery, ListData } from '@/interfaces/request.interface';
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
import { MetadataModel, FieldModel, MetadataTagModel } from './metadata.model';
import { MetadataService } from './metadata.service';
import { HttpProcessor } from '@/decotators/http.decotator';
import { JwtAuthGuard } from '@/guards/auth.guard';
import { ApiBearerAuth, ApiOperation, ApiUseTags, ApiResponse } from '@nestjs/swagger';
import {
  QueryMetadataListDto,
  UpdateMetadataDto,
  AddMetadataDto,
<<<<<<< HEAD
  QueryFieldListDto,
  QueryMetadataTagListDto,
  EventAttrsListDto
=======
  QueryMetadataTagListDto,
  AddMetadataTagDto,
  UpdateMetadataTagDto,
  QueryFieldListDto
>>>>>>> 073f552fead4d3fbaefb2e55f4db2c840fe647da
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

  @HttpProcessor.handle('更新元数据')
  @Put('/')
  @UseGuards(JwtAuthGuard)
  updateMetadata(@Body() body: UpdateMetadataDto): Promise<void> {
    return this.metadataService.updateMetadata(body);
  }

  @HttpProcessor.handle('删除元数据')
  @Delete('/:projectId/:metadataId')
  @UseGuards(JwtAuthGuard)
  deleteMetadata(@Param('metadataId', new ParseIntPipe()) metadataId: number): Promise<void> {
    return this.metadataService.deleteMetadata(metadataId);
  }

  @HttpProcessor.handle('启用元数据')
  @Put('/enable/:projectId/:metadataId')
  @UseGuards(JwtAuthGuard)
  enableMetadata(@Param('metadataId', new ParseIntPipe()) metadataId: number): Promise<void> {
    return this.metadataService.enableMetadata(metadataId);
  }

  @HttpProcessor.handle('停用元数据')
  @Put('/disable/:projectId/:metadataId')
  @UseGuards(JwtAuthGuard)
  disableMetadata(@Param('metadataId', new ParseIntPipe()) metadataId: number): Promise<void> {
    return this.metadataService.disableMetadata(metadataId);
  }

  @HttpProcessor.handle('获取元数据列表')
  // @UseGuards(JwtAuthGuard)
  @Get('/')
  getMetadataList(
    @QueryList(new ParsePageQueryIntPipe(['projectId', 'status']))
    query: QueryListQuery<QueryMetadataListDto>
  ): Promise<PageData<MetadataModel>> {
    return this.metadataService.getMetadataList(query);
  }

  @HttpProcessor.handle('获取tag列表')
  @UseGuards(JwtAuthGuard)
  @Get('/tag')
  getMetadataTags(
    @QueryList(new ParsePageQueryIntPipe(['projectId']))
    query: QueryListQuery<QueryMetadataTagListDto>
  ): Promise<PageData<MetadataTagModel>> {
    return this.metadataService.getMetadataTags(query);
  }

  @HttpProcessor.handle('获取事件属性')
  // @UseGuards(JwtAuthGuard)
  @Get('/fields')
  getEventAttrs(): Promise<ListData<EventAttrsListDto>> {
    return this.metadataService.getFieldList();
  }

  @HttpProcessor.handle('新增标签')
  @Post('/tag')
  @UseGuards(JwtAuthGuard)
  addMetadataTag(@Body() body: AddMetadataTagDto): Promise<void> {
    return this.metadataService.addMetadataTag(body);
  }

  @HttpProcessor.handle('更新标签')
  @Put('/tag')
  @UseGuards(JwtAuthGuard)
  updateMetadataTag(@Body() body: UpdateMetadataTagDto): Promise<void> {
    return this.metadataService.updateMetadataTag(body);
  }

  @HttpProcessor.handle('删除标签')
  @Delete('/tag/:projectId/:tagId')
  @UseGuards(JwtAuthGuard)
  deleteMetadataTag(@Param('tagId', new ParseIntPipe()) tagId: number): Promise<void> {
    return this.metadataService.deleteMetadataTag(tagId);
  }
}
