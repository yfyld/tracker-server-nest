import { IsOptional } from 'class-validator';
import { IIndicatorInfo, IFilterInfo } from './analyse.interface';

export class QueryEventAnalyseDataDto {
  projectId: number;
  indicators: IIndicatorInfo[];
  @IsOptional()
  filter: IFilterInfo;
  @IsOptional()
  dimension: string;
  @IsOptional()
  dateStart: number;
  dateEnd: number;
  dateType: string;
  type: string;
  timeUnit: string;
}

export class QueryFunnelAnalyseDataDto {
  projectId: number;
  indicators: IIndicatorInfo[];
  @IsOptional()
  filter: IFilterInfo;
  @IsOptional()
  dimension: string;
  @IsOptional()
  dateStart: number;
  dateEnd: number;
  dateType: string;
  indicatorType: string;
  type: string;
  @IsOptional()
  timeUnit: string;
  trend: boolean;
}
