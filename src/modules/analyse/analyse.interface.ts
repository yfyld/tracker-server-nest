export interface IFilterValue {
  key: string;
  type: string;
  value: any;
  id: number;
}

export interface IFilterInfo {
  filterType: string;
  filterValues: IFilterValue[];
}

export interface IIndicatorInfo {
  trackId?: string;
  metadataCode: string;
  metadataName: string;
  customName?: string;
  type?: string;
  filter: IFilterInfo;
  id: number;
}

export interface IAnalyseEventData {
  dimension: string;
  dimensionValues: string[];
  type: string;
  timeUnit: string;
  list: IAnalyseEventDataListItem[];
}

export interface ICompare {
  qoqCurrent: number;
  qoqPercentage: number;
  qoqPrev: number;
  yoyCurrent: number;
  yoyPercentage: number;
  yoyPrev: number;
}

export interface IAnalyseEventDataListDataItem {
  count: string;
  time: string;
}

export interface IAnalyseEventDataListItem {
  key: string;
  metadataCode: string;
  metadataName: string;
  data: IAnalyseEventDataListDataItem[];
  compare: ICompare;
}

export interface IAnalyseQueryDataItem {
  count: string;
  time: string;
  [props: string]: string;
}

export interface IFunnelQueryDataItem {
  key: string;
  metadataCode: string;
  metadataName: string;
  customName?: string;
  count: number;
  data: IAnalyseQueryDataItem[];
}

export interface IFunnelData {
  dimension: string;
  dimensionValues: string[];
  type: string;
  conversionRate: number;
  list: IFunnelDataByDimensionItem[];
}
export interface IFunnelDataByDimensionItem {
  dimension: string;
  allData: any[];
  conversionRateMap: { [prop: string]: number };
  data: IFunnelDataByTimeItem[];
}

export interface IFunnelDataByTimeItem {
  time: string;
  conversionRateMap: { [prop: string]: number };
  steps: {
    count: number;
    conversionRate: number;
    metadataName: string;
    metadataCode: string;
    customName?: string;
  }[];
}

export interface IFunnelListItem {
  dimension: string;
  data: {
    count: number;
    time: string;
    metadataName: string;
    customName: string;
    conversionRate?: number;
  }[];
}
