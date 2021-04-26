import { IsString, IsOptional, IsNumber, Length } from 'class-validator';

export class ChannelListReqDto {
  @IsOptional()
  @IsString({ message: '渠道名必须为字符串' })
  name?: string;

  @IsOptional()
  business?: number;

  @IsOptional()
  type?: number;

  @IsOptional()
  source?: number;

  @IsOptional()
  position?: number;

  @IsOptional()
  sortKey?: number;

  @IsOptional()
  sortType?: number;
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

  @IsString({ message: '位置必须为字符串' })
  @Length(0, 1024, { message: '请不要超过1024个字符' })
  @IsOptional()
  position?: string;

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

  @IsString()
  channelId: string;

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

  @IsString({ message: '位置必须为字符串' })
  @Length(0, 1024, { message: '请不要超过1024个字符' })
  position?: string;

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

export class AllChannelListItemDto {
  @IsNumber()
  id: number;

  @IsString()
  channelId: string;

  @IsString({ message: '渠道名必须为字符串' })
  @Length(0, 128, { message: '请不要超过128个字符' })
  name: string;

  @IsString({ message: '渠道类型必须为字符串' })
  @Length(0, 128, { message: '请不要超过128个字符' })
  type: string;

  typeName: string;
  businessName: string;
  sourceName: string;
  positionName: string;

  @IsString({ message: '业务线必须为字符串' })
  @Length(0, 1024, { message: '请不要超过1024个字符' })
  business: string;

  @IsString({ message: '来源必须为字符串' })
  @Length(0, 1024, { message: '请不要超过1024个字符' })
  source: string;

  @IsString({ message: '位置必须为字符串' })
  @Length(0, 1024, { message: '请不要超过1024个字符' })
  position?: string;

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

  createdAt: Date;
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

  @IsString({ message: '位置必须为字符串' })
  @Length(0, 1024, { message: '请不要超过1024个字符' })
  @IsOptional()
  position?: string;

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

  @IsNumber()
  id: number;
}

export class QueryChannelListDto {
  @IsOptional()
  @IsString({ message: '渠道名必须为字符串' })
  name?: string;
}
