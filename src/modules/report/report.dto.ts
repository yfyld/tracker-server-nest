import { IsNotEmpty, IsDefined, IsInt, IsString, IsOptional, IsNumber } from 'class-validator';
import { ApiModelProperty } from '@nestjs/swagger';
import { ProjectModel } from '../project/project.model';

export class AddReportDto {
  @IsString()
  name: string;
  @IsOptional()
  @IsString()
  description?: string;
  @IsOptional()
  boardId?: number;
  @IsString()
  type: string;
  @IsDefined()
  data: any;
  @IsNumber()
  projectId: number;
}

export class ReportDto {
  @ApiModelProperty()
  @IsDefined()
  @IsNotEmpty({ message: '应用名称不能为空' })
  name: string;
  @ApiModelProperty()
  id: string;
  @ApiModelProperty()
  type: string;
  @ApiModelProperty()
  level: number;
  @ApiModelProperty()
  status: number;
  @ApiModelProperty()
  message: string;
  @ApiModelProperty()
  url: string;
  @ApiModelProperty()
  version?: string;
  @ApiModelProperty()
  project: ProjectModel | { id: number };
}

export class QueryReportListDto {
  @ApiModelProperty()
  @IsDefined()
  @IsNotEmpty({ message: '应用名称不能为空' })
  projectId: string;

  @IsOptional()
  @IsString()
  tag: string;
  @IsOptional()
  @IsNumber()
  status: number;
  @IsOptional()
  @IsString()
  name: string;

  @IsOptional()
  @IsNumber()
  boardId: number;
}

export class UpdateReportDto {
  id: number;
  @IsString()
  name: string;
  @IsOptional()
  @IsString()
  description?: string;
  @IsOptional()
  boardId?: number;
  @IsString()
  type: string;
  @IsDefined()
  data: any;
  @IsNumber()
  projectId: number;
}

export class SourceCodeDto {
  code: string;
  line: number;
  column: number;
  sourceUrl: string;
  name: string;
}

export class QueryFieldListDto {
  @IsDefined()
  projectId: number;
  type: number;
  status: number;
  name?: string;
}

export class QueryReportInfoDto {
  @IsDefined()
  projectId: number;
  @IsDefined()
  id: number;
}
