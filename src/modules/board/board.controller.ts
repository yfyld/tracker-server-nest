import { PERMISSION_CODE } from './../../constants/permission.contant';
import { PermissionsGuard } from '@/guards/permission.guard';
import { ParseIntPipe } from './../../pipes/parse-int.pipe';
import { BoardModel } from './board.model';
import { ParsePageQueryIntPipe } from './../../pipes/parse-page-query-int.pipe';
import { QueryList } from '@/decotators/query-list.decorators';
import { HttpProcessor } from '@/decotators/http.decotator';
import {
  AddBoardDto,
  QueryBoardListDto,
  QueryBoardInfoDto,
  BoardInfoDto,
  UpdateBoardDto,
  AddReportToBoardDto,
  QueryMyBoardListDto,
  DeleteBoardDto
} from './board.dto';
import { BoardService } from './board.service';
import { ApiOperation, ApiUseTags } from '@nestjs/swagger';
import { MULTER_OPTIONS, BASE_URL } from '../../app.config';
import {
  Controller,
  Post,
  UseInterceptors,
  UploadedFile,
  UseGuards,
  Body,
  Get,
  Query,
  Req,
  Put,
  Delete
} from '@nestjs/common';

import { JwtAuthGuard } from '@/guards/auth.guard';
import { Auth } from '@/decotators/user.decorators';
import { QueryListQuery, PageData } from '@/interfaces/request.interface';
import { Permissions } from '@/decotators/permissions.decotators';

@ApiUseTags('看板')
@Controller('board')
@UseGuards(JwtAuthGuard, PermissionsGuard)
export class BoardController {
  constructor(private readonly boardService: BoardService) {}

  @HttpProcessor.handle('新增看板')
  @Post('/')
  @Permissions(PERMISSION_CODE.BOARD_ADD)
  async addBoard(@Body() body: AddBoardDto, @Auth() user) {
    return this.boardService.addBoard(body, user);
  }

  @HttpProcessor.handle('编辑看板')
  @Put('/')
  @Permissions(PERMISSION_CODE.BOARD_UPDATE)
  async updateBoard(@Body() body: UpdateBoardDto) {
    return this.boardService.updateBoard(body);
  }

  @HttpProcessor.handle('删除看板')
  @Delete('/')
  @Permissions(PERMISSION_CODE.BOARD_DEL)
  async deleteBoard(@Query() query: DeleteBoardDto) {
    return this.boardService.deleteBoard(query);
  }

  @HttpProcessor.handle('看板列表')
  @Get('/')
  @Permissions(PERMISSION_CODE.BOARD_SEARCH)
  async getBoards(
    @QueryList(new ParsePageQueryIntPipe(['projectId', 'status']))
    query: QueryListQuery<QueryBoardListDto>,
    @Auth() user
  ): Promise<PageData<BoardModel>> {
    return this.boardService.getBoards(query, user);
  }

  @HttpProcessor.handle('看板详情')
  @Get('/info')
  @Permissions(PERMISSION_CODE.BOARD_INFO)
  async getBoardInfo(@Query(new ParseIntPipe(['projectId', 'id'])) query: QueryBoardInfoDto): Promise<BoardModel> {
    return this.boardService.getBoardInfo(query);
  }

  @HttpProcessor.handle('添加报表到看板')
  @Post('/append')
  @Permissions(PERMISSION_CODE.BOARD_UPDATE)
  async appendReport(@Body() body: AddReportToBoardDto) {
    return this.boardService.appendReportBoard(body);
  }

  @HttpProcessor.handle('我的看板')
  @Get('/my-board')
  async getMyBoards(
    @QueryList(new ParsePageQueryIntPipe(['type'])) query: QueryListQuery<QueryMyBoardListDto>,
    @Auth() user
  ): Promise<PageData<BoardModel>> {
    return this.boardService.getMyBoards(query, user);
  }
}
