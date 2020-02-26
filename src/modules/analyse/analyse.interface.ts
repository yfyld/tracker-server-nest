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
  type?: string;
  filter: IFilterInfo;
  id: number;
}
