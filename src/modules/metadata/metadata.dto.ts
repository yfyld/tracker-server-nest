import { IsNotEmpty, IsDefined, IsInt, IsString, IsOptional, IsNumber } from 'class-validator';
import { ApiModelProperty } from '@nestjs/swagger';
import { ProjectModel } from '../project/project.model';

export class AddMetadataDto {
  @IsString()
  code: string;
  @IsString()
  name: string;
  @IsOptional()
  @IsString()
  description?: string;
  @IsNumber()
  status: number;
  @IsNumber()
  projectId: number;
}

export class MetadataDto {
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

export class QueryMetadataListDto {
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

export class UpdateMetadataDto {
  guarderId?: number;
  level?: number;
  status?: number;
  @IsDefined()
  metadataIds: string[];
  @IsDefined()
  actionType: string;
}

export class AddMetadataTagDto {
  @IsString()
  name: string;
  @IsOptional()
  @IsString()
  description?: string;
  @IsNumber()
  projectId: number;
}

export class QueryMetadataTagListDto {
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
