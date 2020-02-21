import { ReportModel } from './../report/report.model';
import { BoardModel } from './board.model';
import { IsNotEmpty, IsDefined, IsInt, IsOptional } from 'class-validator';
import { ApiModelProperty } from '@nestjs/swagger';
import { ProjectModel } from '../project/project.model';

export class BoardDto {
  @IsDefined()
  @IsNotEmpty({ message: '项目名称不能为空' })
  name: string;
  id: number;

  project: ProjectModel | { id: number };
}

export class DeleteBoardDto {
  id: number;
  projectId: number;
}

export class QueryBoardListDto {
  @IsOptional()
  projectId: number;
  @IsOptional()
  isPublic: boolean;
  @IsOptional()
  name: string;
  @IsOptional()
  status: number;
  @IsOptional()
  isShared: boolean;
}

export class QueryBoardInfoDto {
  @IsDefined()
  projectId: number;
  @IsDefined()
  id: number;
}

export class BoardInfoDto extends BoardModel {
  @IsDefined()
  reportList: ReportModel[];
}

export class AddBoardDto {
  @IsDefined()
  @IsNotEmpty({ message: '看板名称不能为空' })
  name: string;
  @IsDefined()
  projectId: number;
  @IsDefined()
  layout: {
    x: number;
    y: number;
    w: number;
    h: number;
    i: string;
  }[];
  type: string;
  status: number;
}

export class UpdateBoardDto {
  @IsOptional()
  name: string;
  @IsOptional()
  description?: string;
  @IsDefined()
  id: number;
  @IsDefined()
  projectId: number;
  @IsOptional()
  layout: {
    x: number;
    y: number;
    w: number;
    h: number;
    i: string;
  }[];
  status: number;
}

export class AddReportToBoardDto {
  @IsDefined()
  projectId: number;
  @IsDefined()
  boardIds: number[];
  @IsDefined()
  reportId: number;
}

export class RemoveReportBoardDto {
  @IsDefined()
  projectId: number;
  @IsDefined()
  boardId: number;
  @IsDefined()
  reportId: number;
}

export class QueryMyBoardListDto {
  @IsOptional()
  projectId: number;
  @IsOptional()
  isPublic: boolean;
  @IsOptional()
  name: string;
  @IsOptional()
  type: number;
}
