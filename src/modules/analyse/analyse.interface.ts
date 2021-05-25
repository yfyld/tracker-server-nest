export interface IFilterValue {
  key: string;
  type: string;
  value: any;
  id: string;
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
  projectId?: number;
  type?: string;
  filter: IFilterInfo;
  id: string;
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
  indicatorType: string;
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
  indicatorType: string;
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

export interface IPathData {
  data: IPathDataDataItem[];
  links: IPathDataLinksItem[];
  indicatorType: string;
}

export interface IPathDataDataItem {
  id: string;
  name: string;
  value: number;
}

export interface IPathDataLinksItem {
  source: string;
  target: string;
  value: number;
  sourceName: string;
  targetName: string;
  conversionRate: number;
}

export interface IAnalyseKaerData {
  list: {
    pv: number;
    uv: number;
    time: string;
  }[];
}

export interface IAnalyseKaerDataListDataItem {
  pv: string;
  uv: string;
  time: string;
}
