import { IsNotEmpty, IsDefined, IsInt, IsString, IsOptional, IsNumber } from 'class-validator';
import { ApiModelProperty } from '@nestjs/swagger';
import { ProjectModel } from '../project/project.model';
import { MetadataTagModel } from './metadata.model';

export class QueryAutotrackListDto {
  @IsOptional()
  projectId?: number;

  @IsOptional()
  @IsString()
  name: string;
  @IsString()
  code: string;
  @IsNumber()
  type: number;
}
