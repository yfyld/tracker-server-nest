import { IsNotEmpty, IsDefined, IsInt, IsString, IsOptional, IsDate, IsNumber, Length } from 'class-validator';
import { ApiModelProperty } from '@nestjs/swagger';
import { ProjectModel } from '../project/project.model';
import { ModuleModel } from './module.model';
import { Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

export class ModuleListReqDto {
  @IsOptional()
  @IsString({ message: '模块名必须为字符串' })
  name?: string;
}

export class AddModuleDto {
  @IsString({ message: '模块名必须为字符串' })
  @Length(0, 32, { message: '请不要超过32个字符' })
  name: string;

  @IsString({ message: '描述必须为字符串' })
  description?: string;
}

export class ModuleListItemDto {
  @IsNumber()
  id: number;

  @IsString()
  @Length(0, 32, { message: '请不要超过32个字符' })
  name: string;

  @IsString()
  @Length(0, 1024, { message: '请不要超过32个字符' })
  description: string;

  @IsDate()
  createdAt: Date;

  @IsDate()
  updatedAt: Date;
}

export class UpdateModuleDto {
  @IsString({ message: '模块名必须为字符串' })
  @Length(0, 32, { message: '请不要超过32个字符' })
  name?: string;

  @IsString({ message: '描述必须为字符串' })
  description?: string;

  @IsNumber()
  id: number;
}

export class QueryModuleListDto {
  @IsOptional()
  @IsString({ message: '模块名必须为字符串' })
  name?: string;
}
