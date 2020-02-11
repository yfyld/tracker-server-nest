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
  time: { date: string[]; type: string };
  type: string;
  timeUlit: string;
}
