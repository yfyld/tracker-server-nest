import { IsNotEmpty, IsDefined, IsInt, IsString, IsOptional, IsDate, IsNumber } from 'class-validator';
import { ApiModelProperty } from '@nestjs/swagger';
import { ProjectModel } from '../project/project.model';
import { ModuleModel } from './module.model';

export class ModuleListReqDto {
  @IsOptional()
  name?: string;
}

export class AddModuleDto {
  @IsString()
  name: string;

  @IsString()
  description: string;
}

export class ModuleListItemDto {
  @IsNumber()
  id: number;

  @IsString()
  name: string;

  @IsString()
  description: string;

  @IsDate()
  createdAt: Date;

  @IsDate()
  updatedAt: Date;
}
