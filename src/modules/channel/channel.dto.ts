import { IsNotEmpty, IsDefined, IsInt, IsString, IsOptional, IsDate, IsNumber, Length } from 'class-validator';
import { ApiModelProperty } from '@nestjs/swagger';
import { ProjectModel } from '../project/project.model';
import { ChannelModel } from './channel.model';
import { Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

export class ChannelListReqDto {
  @IsOptional()
  @IsString({ message: '渠道名必须为字符串' })
  name?: string;

  @IsOptional()
  @IsNumber()
  id?: string;
}

export class AddChannelDto {
  @IsString({ message: '渠道名必须为字符串' })
  @Length(0, 128, { message: '请不要超过128个字符' })
  name: string;

  @IsString({ message: '渠道类型必须为字符串' })
  @Length(0, 128, { message: '请不要超过128个字符' })
  type: string;

  @IsString({ message: '业务线必须为字符串' })
  @Length(0, 1024, { message: '请不要超过1024个字符' })
  business: string;

  @IsString({ message: '来源必须为字符串' })
  @Length(0, 1024, { message: '请不要超过1024个字符' })
  source: string;

  @IsString({ message: '活动必须为字符串' })
  @Length(0, 1024, { message: '请不要超过1024个字符' })
  @IsOptional()
  activity?: string;

  @IsString({ message: '内容必须为字符串' })
  @Length(0, 1024, { message: '请不要超过1024个字符' })
  @IsOptional()
  content?: string;

  @IsString({ message: '关键词必须为字符串' })
  @Length(0, 1024, { message: '请不要超过1024个字符' })
  @IsOptional()
  keyword?: string;

  @IsString({ message: '描述必须为字符串' })
  @Length(0, 1024, { message: '请不要超过1024个字符' })
  @IsOptional()
  description?: string;
}

export class ChannelListItemDto {
  @IsNumber()
  id: number;

  @IsString({ message: '渠道名必须为字符串' })
  @Length(0, 128, { message: '请不要超过128个字符' })
  name: string;

  @IsString({ message: '渠道类型必须为字符串' })
  @Length(0, 128, { message: '请不要超过128个字符' })
  type: string;

  @IsString({ message: '业务线必须为字符串' })
  @Length(0, 1024, { message: '请不要超过1024个字符' })
  business: string;

  @IsString({ message: '来源必须为字符串' })
  @Length(0, 1024, { message: '请不要超过1024个字符' })
  source: string;

  @IsString({ message: '活动必须为字符串' })
  @Length(0, 1024, { message: '请不要超过1024个字符' })
  activity?: string;

  @IsString({ message: '内容必须为字符串' })
  @Length(0, 1024, { message: '请不要超过1024个字符' })
  content?: string;

  @IsString({ message: '关键词必须为字符串' })
  @Length(0, 1024, { message: '请不要超过1024个字符' })
  keyword?: string;

  @IsString({ message: '描述必须为字符串' })
  @Length(0, 1024, { message: '请不要超过1024个字符' })
  description?: string;
}

export class UpdateChannelDto {
  @IsString({ message: '渠道名必须为字符串' })
  @Length(0, 128, { message: '请不要超过128个字符' })
  name?: string;

  @IsString({ message: '渠道类型必须为字符串' })
  @Length(0, 128, { message: '请不要超过128个字符' })
  type?: string;

  @IsString({ message: '业务线必须为字符串' })
  @Length(0, 1024, { message: '请不要超过1024个字符' })
  business?: string;

  @IsString({ message: '来源必须为字符串' })
  @Length(0, 1024, { message: '请不要超过1024个字符' })
  source?: string;

  @IsString({ message: '活动必须为字符串' })
  @Length(0, 1024, { message: '请不要超过1024个字符' })
  activity?: string;

  @IsString({ message: '内容必须为字符串' })
  @Length(0, 1024, { message: '请不要超过1024个字符' })
  content?: string;

  @IsString({ message: '关键词必须为字符串' })
  @Length(0, 1024, { message: '请不要超过1024个字符' })
  keyword?: string;

  @IsString({ message: '描述必须为字符串' })
  @Length(0, 1024, { message: '请不要超过1024个字符' })
  description?: string;

  @IsNumber()
  id: number;
}

export class QueryChannelListDto {
  // todo: fix this dto
  @IsOptional()
  @IsString({ message: '渠道名必须为字符串' })
  name?: string;
}
