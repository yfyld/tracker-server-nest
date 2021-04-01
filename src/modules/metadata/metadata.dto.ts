import { IsNotEmpty, IsDefined, IsInt, IsString, IsOptional, IsNumber } from 'class-validator';
import { ApiModelProperty } from '@nestjs/swagger';
import { ProjectModel } from '../project/project.model';
import { MetadataTagModel } from './metadata.model';

export class AddMetadataDto {
  @IsString()
  code: string;
  @IsString()
  name: string;
  @IsNumber()
  type: number;
  @IsOptional()
  @IsString()
  description?: string;
  @IsNumber()
  status: number;
  @IsOptional()
  tags?: number[];
  @IsOptional()
  newTags?: string[];

  @IsOptional()
  url?: string;
  @IsOptional()
  @IsNumber()
  checkoutStatus?: number;
  @IsOptional()
  operatorType?: number;

  @IsNumber()
  @IsOptional()
  log?: number;

  @IsNumber()
  @IsOptional()
  logRecent?: number;

  @IsNumber()
  projectId: number;

  @IsNumber()
  moduleId: number;

  @IsString()
  pageType: string;
}

export class AddMetadataByExcelDto {
  @IsString()
  @IsOptional()
  path?: string;

  @IsString()
  @IsOptional()
  url?: string;
  @IsNumber()
  projectId: number;
}

export class UpdateMetadataDto {
  @IsNumber()
  id: number;
  @IsOptional()
  @IsString()
  code?: string;
  @IsString()
  @IsOptional()
  name?: string;
  @IsNumber()
  @IsOptional()
  type?: number;
  @IsOptional()
  operatorType?: number;
  @IsOptional()
  @IsString()
  description?: string;
  @IsNumber()
  @IsOptional()
  status?: number;
  @IsOptional()
  @IsNumber()
  checkoutStatus?: number;
  @IsOptional()
  tags?: number[];
  @IsOptional()
  newTags?: string[];
  @IsNumber()
  moduleId: number;
  @IsNumber()
  @IsOptional()
  log?: number;
  @IsNumber()
  projectId: number;
}

export class UpdateMetadataLogDto {
  @IsNumber()
  id: number;
  @IsNumber()
  @IsOptional()
  projectId?: number;
}

export class UpdateMetadataBatchDto {
  ids: number[];
  @IsString()
  @IsOptional()
  type: string;

  @IsOptional()
  @IsNumber()
  status?: number;

  @IsOptional()
  @IsNumber()
  checkoutStatus?: number;

  @IsOptional()
  tags?: string[];

  @IsNumber()
  projectId: number;
}

export class MetadataDto {
  @ApiModelProperty()
  @IsDefined()
  @IsNotEmpty({ message: '元数据名称不能为空' })
  name: string;
  @ApiModelProperty()
  id: string;
  @ApiModelProperty()
  type: string;
  @IsOptional()
  operatorType: number;
  @ApiModelProperty()
  level: number;
  @ApiModelProperty()
  status: number;
  @IsOptional()
  @IsNumber()
  checkoutStatus?: number;
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
  @IsNotEmpty({ message: '应用不能为空' })
  projectId: number;

  @IsOptional()
  isAssociation: boolean;

  @IsOptional()
  projectIds: string;

  @IsOptional()
  operatorType?: number;

  @IsOptional()
  @IsNumber()
  status: number;
  @IsOptional()
  @IsNumber()
  checkoutStatus?: number;
  @IsOptional()
  @IsString()
  name: string;
  @IsString()
  code: string;
  @IsNumber()
  type: number;
  @IsString()
  tags: string;
  @IsString()
  log: string;
  @IsString()
  pageTypes: string;
  @IsString()
  modules: string;
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

export class UpdateMetadataTagDto {
  @IsNumber()
  id: number;
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

export class GetEventAttrDto {
  metadataCode?: string;
  projectId: number;
}

export class QueryFieldListDto {
  @IsDefined()
  projectId: number;
  type: number;
  status: number;
  name?: string;
}

export class EventAttrsListDto {
  name: string;
  value: string;
  type: string;
  recommend: {
    text: string;
    value: any;
  }[];
}
