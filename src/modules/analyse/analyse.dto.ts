import { IsNumber, IsOptional, IsString } from 'class-validator';
import { IIndicatorInfo, IFilterInfo } from './analyse.interface';

export class QueryKaerAnalyseDataDto {
  @IsOptional()
  @IsString()
  url?: string;
  @IsOptional()
  @IsString()
  trackId?: string;
  @IsNumber()
  dateStart: number;
  @IsNumber()
  dateEnd: number;
  @IsOptional()
  @IsString()
  dateType?: string;
  @IsOptional()
  @IsString()
  appId?: string;
  @IsOptional()
  @IsString()
  channel?: string;
}

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

export class QueryCustomAnalyseDataDto {
  projectId: number;
  dateStart: number;
  dateEnd: number;
  dateType: string;
  query: string;
  env: string;
}

export class QueryPathAnalyseDataDto {
  projectId: number;
  indicators: IIndicatorInfo[];
  @IsOptional()
  filter: IFilterInfo;
  @IsOptional()
  dateStart: number;
  dateEnd: number;
  dateType: string;
  indicatorType: string;
  type: string;
  childPageData: [
    {
      parentId: string;
      children: [{ id: string; filter: IFilterInfo }];
    }
  ];
}

export class QueryUserTimelineAnalyseDataDto {
  projectId: number;
  dateStart: number;
  dateEnd: number;
  dateType: string;
  uid?: string;
  deviceId?: string;
  mobile?: string;
  ip?: string;
  custom?: string;
  id?: string;
}

export class QueryCheckoutAnalyseDataDto {
  projectId: number;
  dateStart: number;
  dateEnd: number;
  dateType: string;
  uid?: string;
  deviceId?: string;
  mobile?: string;
  ip?: string;
  custom?: string;
  env?: string;
  appId?: string;
  slsquery?: string;
  channel?: string;
  sessionId?: string;
  version?: string;
  isAutoTrack: boolean;
  checkoutStatus: number;
  selfCheckoutStatus: number;
}
