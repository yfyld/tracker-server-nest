import { IsString, IsOptional, IsNumber, Length } from 'class-validator';
import { isNumber } from 'typegoose/lib/utils';

export class AddCheckoutLogDto {
  @IsString({ message: '必须为字符串' })
  logId: string;
  @IsString({ message: '必须为字符串' })
  trackId: string;
  @IsNumber()
  status: number;

  @IsNumber()
  type: number;
  @IsOptional()
  @IsString({ message: '必须为字符串' })
  description: string;
}

export class UpdateCheckoutLogDto {
  @IsNumber()
  id: number;
  @IsString({ message: '必须为字符串' })
  logId: string;
  @IsString({ message: '必须为字符串' })
  trackId: string;
  @IsNumber()
  status: number;
  @IsNumber()
  type: number;
  @IsOptional()
  @IsString({ message: '必须为字符串' })
  description: string;
}
