import { IsInt, IsString, Length, MaxLength, IsOptional, IsDate } from 'class-validator';

export class AppIdInsertDto {
  @IsString({ message: '应用名必须为字符串' })
  @Length(0, 32, { message: '请不要超过32个字符' })
  appName: string;

  @IsString({ message: '业务线必须为字符串' })
  business: string;

  @IsString({ message: '客户端类型必须为字符串' })
  @Length(0, 32, { message: '请不要超过32个字符' })
  clientType: string;

  @IsString({ message: '从属端类型必须为字符串' })
  @Length(0, 32, { message: '请不要超过32个字符' })
  subordinateType: string;

  @IsOptional()
  @IsString({ message: '描述必须为字符串' })
  description: string;
}

export class AppIdListDto {
  @IsString({ message: '应用名必须为字符串' })
  @Length(0, 32, { message: '请不要超过32个字符' })
  fuzzyName: string;

  @IsOptional()
  sortKey?: string;

  @IsOptional()
  sortType?: string;
}
