import { IsNotEmpty, IsDefined, IsInt, IsString, IsOptional, IsNumber } from 'class-validator';
import { ApiModelProperty } from '@nestjs/swagger';
import { ProjectModel } from '../project/project.model';

export class AddTeamDto {
  @IsString()
  name: string;
  @IsOptional()
  @IsString()
  description?: string;
  @IsString()
  type: string;
  @IsDefined()
  data: any;
  @IsNumber()
  projectId: number;
}

export class TeamDto {
  @ApiModelProperty()
  @IsDefined()
  @IsNotEmpty({ message: '项目名称不能为空' })
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

export class QueryTeamListDto {
  @ApiModelProperty()
  @IsDefined()
  @IsNotEmpty({ message: '项目名称不能为空' })
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
}

export class UpdateTeamDto {
  guarderId?: number;
  level?: number;
  status?: number;
  @IsDefined()
  teamIds: string[];
  @IsDefined()
  actionType: string;
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
