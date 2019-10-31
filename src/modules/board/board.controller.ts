import { ParseIntPipe } from './../../pipes/parse-int.pipe';
import { BoardModel } from './board.model';
import { ParsePageQueryIntPipe } from './../../pipes/parse-page-query-int.pipe';
import { QueryList } from '@/decotators/query-list.decorators';
import { HttpProcessor } from '@/decotators/http.decotator';
import { AddBoardDto, QueryBoardListDto, QueryBoardInfoDto, BoardInfoDto, UpdateBoardDto } from './board.dto';
import { BoardService } from './board.service';
import { ApiOperation, ApiUseTags } from '@nestjs/swagger';
import { MULTER_OPTIONS, BASE_URL } from '../../app.config';
import { Controller, Post, UseInterceptors, UploadedFile, UseGuards, Body, Get, Query, Req, Put } from '@nestjs/common';

import { JwtAuthGuard } from '@/guards/auth.guard';
import { Auth } from '@/decotators/user.decorators';
import { QueryListQuery, PageData } from '@/interfaces/request.interface';

@ApiUseTags('看板')
@Controller('board')
@UseGuards(JwtAuthGuard)
export class BoardController {
  constructor(private readonly boardService: BoardService) {}

  @HttpProcessor.handle('新增看板')
  @Post('/')
  @UseGuards(JwtAuthGuard)
  async addBoard(@Body() body: AddBoardDto, @Auth() user) {
    return this.boardService.addBoard(body, user);
  }

  @HttpProcessor.handle('编辑看板')
  @Put('/')
  @UseGuards(JwtAuthGuard)
  async updateBoard(@Body() body: UpdateBoardDto) {
    return this.boardService.updateBoard(body);
  }

  @HttpProcessor.handle('看板列表')
  @Get('/')
  @UseGuards(JwtAuthGuard)
  async getBoards(
    @QueryList(new ParsePageQueryIntPipe(['projectId', 'status']))
    query: QueryListQuery<QueryBoardListDto>,
    @Auth() user
  ): Promise<PageData<BoardModel>> {
    return this.boardService.getBoards(query, user);
  }

  @HttpProcessor.handle('看板详情')
  @Get('/info')
  @UseGuards(JwtAuthGuard)
  async getBoardInfo(
    @Query(new ParseIntPipe(['projectId', 'boradId'])) query: QueryBoardInfoDto
  ): Promise<BoardInfoDto> {
    return this.boardService.getBoardInfo(query);
  }
}
