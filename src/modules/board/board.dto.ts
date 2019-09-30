import { IsNotEmpty, IsDefined, IsInt, IsOptional } from 'class-validator';
import { ApiModelProperty } from '@nestjs/swagger';
import { ProjectModel } from '../project/project.model';

export class BoardDto {
  @IsDefined()
  @IsNotEmpty({ message: '项目名称不能为空' })
  name: string;
  id: string;

  project: ProjectModel | { id: number };
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
  reports: number[];
  type: string;
  status: number;
}
