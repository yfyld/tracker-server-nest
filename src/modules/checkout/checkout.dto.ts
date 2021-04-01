import { IsString, IsOptional, IsNumber, Length } from 'class-validator';

export class AddCheckoutLogDto {
  @IsString({ message: '必须为字符串' })
  logId: string;
  @IsString({ message: '必须为字符串' })
  trackId: string;
  @IsNumber()
  status: number;

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

  @IsOptional()
  @IsString({ message: '必须为字符串' })
  description: string;
}
