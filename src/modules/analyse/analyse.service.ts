import {
  IFunnelQueryDataItem,
  IFunnelData,
  IAnalyseQueryDataItem,
  IFunnelDataByDimensionItem
} from './analyse.interface';
import { SlsService } from '@/providers/sls/sls.service';
import { Injectable } from '@nestjs/common';
import { QueryEventAnalyseDataDto } from './analyse.dto';
import { filterToQuery } from './analyse.util';
import { getDynamicTime } from '@/utils/date';
import { MetadataService } from '../metadata/metadata.service';

@Injectable()
export class AnalyseService {
  constructor(private readonly slsService: SlsService, private readonly metadataService: MetadataService) {}
  /**
   *
   * @param 过滤条件
   * @param 时间
   * 环比同比
   */
  public async diff(filers, timeParam): Promise<any> {
    const window = Math.floor((timeParam.dateEnd - timeParam.dateStart) / 1000);
    // tslint:disable-next-line:max-line-length
    const query = `${filers}|select qoq[1] as qoqCurrent, qoq[2] as qoqPrev, qoq[3] as qoqPercentage, yoy[1] as yoyCurrent, yoy[2] as yoyPrev, yoy[3] as yoyPercentage from(select  compare( pv , ${window}) as qoq ,compare( pv , ${window +
      86400 * 365}) as yoy  from (select count(1) as pv  from log ))`;
    const data = await this.slsService.query({
      query,
      from: Math.floor(timeParam.dateStart / 1000),
      to: Math.floor(timeParam.dateEnd / 1000)
    });
    return data[0];
  }

  /**
   * 生成sql group order
   * @param dimension
   * @param hasTime
   */
  private getGroup(dimension: string, hasTime: boolean) {
    if (dimension && !hasTime) {
      return `,${dimension}  GROUP BY ${dimension}`;
    } else if (dimension && hasTime) {
      return `,${dimension} GROUP BY time, ${dimension} ORDER BY time`;
    } else if (hasTime) {
      return ` group by time order by time`;
    } else {
      return ``;
    }
  }

  /**
   * 生成sql
   * @param indicatorType
   * @param showType
   * @param timeUnit
   * @param demension
   */
  private getSelect(indicatorType: string, showType: string, timeUnit = 'day', demension = '') {
    const key = [];
    let hasTime = false;
    const isTrend = showType === 'LINE' || showType === 'BAR' || showType === 'TABLE' || showType === 'LIST';
    if (indicatorType === 'PV' || indicatorType === 'DPV') {
      key.push(`count(1) as count`);
    } else if (indicatorType === `UV` || indicatorType === 'DUV') {
      key.push(`approx_distinct(utoken) as count`);
    } else if (indicatorType === 'APV') {
      key.push(`count(1) / approx_distinct(utoken) as count`);
    }

    if (indicatorType === 'DUV' || indicatorType === 'DPV') {
      key.push(`date_format(trackTime,'%H') as time`);
      hasTime = true;
    } else if (isTrend) {
      key.push(`date_trunc('${timeUnit.toLowerCase()}', trackTime) as time`);
      hasTime = true;
    }
    const group = this.getGroup(demension, hasTime);
    return ' select ' + key.join(',') + group + ' limit 1000';
  }

  private computedRate(n: number, m: number) {
    if (!n) {
      return null;
    } else {
      return Math.floor((m / n) * 100);
    }
  }

  private computedConversionRateMap(steps, stepLength: number, topKey: string, rootKey: string) {
    const conversionRateMap = steps.reduce(
      (total, step) => {
        total[step.key] = step.conversionRate || 0;
        return total;
      },
      { _ALL: 0 }
    );
    conversionRateMap._ALL =
      typeof conversionRateMap[topKey] !== 'undefined' && typeof conversionRateMap[rootKey] !== 'undefined'
        ? this.computedRate(steps[0].count, steps[stepLength - 1].count)
        : 0;

    return conversionRateMap;
  }

  private getFunnelListData(list: IFunnelQueryDataItem[], dimension?: string): IFunnelDataByDimensionItem[] {
    //少于2step 和第一个step 为0 return []
    if (list.length <= 1 || list[0].data.length === 0 || list[0].count === 0) {
      return [];
    }

    //跟step 顶部step
    const stepLength = list.length;
    const rootStepData = list[0];
    const topStepData = list[stepLength - 1];

    //dateMap.dimension.time
    const dataMap: {
      [prop: string]: {
        [prop: string]: {
          count: number;
          key: string;
          metadataName: string;
          metadataCode: string;
          customName?: string;
        }[];
      };
    } = {};

    const dimensionCountMap = {};
    const timeCountMap = {};

    const allDataMap: {
      [prop: string]: {
        count: number;
        conversionRate: number;
        key: string;
        metadataName: string;
        metadataCode: string;
        customName: string;
      }[];
    } = { '': [] };

    let oldCount = null;
    list.forEach(item => {
      const conversionRate = this.computedRate(oldCount, item.count);
      oldCount = item.count;
      allDataMap[''].push({
        count: Number(item.count),
        conversionRate,
        key: item.key,
        metadataName: item.metadataName,
        metadataCode: item.metadataCode,
        customName: item.customName
      });

      item.data.forEach(val => {
        if (val.time) {
          if (!timeCountMap[val.time]) {
            timeCountMap[val.time] = {};
          }
          if (!timeCountMap[val.time][item.key]) {
            timeCountMap[val.time][item.key] = 0;
          }

          timeCountMap[val.time][item.key] += Number(val.count);
        }
        if (dimension) {
          if (!dimensionCountMap[val[dimension]]) {
            dimensionCountMap[val[dimension]] = {};
          }
          if (!dimensionCountMap[val[dimension]][item.key]) {
            dimensionCountMap[val[dimension]][item.key] = 0;
          }
          dimensionCountMap[val[dimension]][item.key] += Number(val.count);
        }

        if (val.time && dimension) {
          if (!dataMap[val[dimension]]) {
            dataMap[val[dimension]] = {};
          }
          if (!dataMap[val[dimension]][val.time]) {
            dataMap[val[dimension]][val.time] = [];
          }
          dataMap[val[dimension]][val.time].push({
            count: Number(val.count),
            key: item.key,
            metadataName: item.metadataName,
            metadataCode: item.metadataCode,
            customName: item.customName
          });
        }
      });
    });

    Object.entries(dimensionCountMap).forEach(([key, value]) => {
      let oldCount = null;
      allDataMap[key] = Object.entries(value).map(([key2, value2]) => {
        const item = list.find(item => item.key === key2);
        const conversionRate = this.computedRate(oldCount, value2);
        oldCount = value2;
        return {
          count: Number(value2),
          key: item.key,
          conversionRate,
          metadataName: item.metadataName,
          metadataCode: item.metadataCode,
          customName: item.customName
        };
      });
    });

    const result: IFunnelDataByDimensionItem[] = Object.entries(dataMap).map(([key, value]) => {
      return {
        dimension: key,
        allData: allDataMap[key],
        conversionRateMap: this.computedConversionRateMap(
          allDataMap[key],
          stepLength,
          topStepData.key,
          rootStepData.key
        ),
        data: Object.entries(value)
          .map(([key2, value2]) => {
            let oldCount = null;
            const steps = value2.map(item => {
              const conversionRate = this.computedRate(oldCount, item.count);
              oldCount = item.count;
              return { ...item, conversionRate };
            });
            return {
              time: key2,
              conversionRateMap: this.computedConversionRateMap(steps, stepLength, topStepData.key, rootStepData.key),
              steps
            };
          })
          .sort((n, m) => (n.time > m.time ? 1 : -1))
      };
    });

    result.push({
      dimension: '总值',
      allData: allDataMap[''],
      conversionRateMap: this.computedConversionRateMap(allDataMap[''], stepLength, topStepData.key, rootStepData.key),
      data: Object.entries(timeCountMap)
        .map(([key, value]) => {
          let oldcount = 0;
          const steps = Object.entries(value).map(([key2, value2]) => {
            const item = list.find(item => item.key === key2);
            const conversionRate = this.computedRate(oldcount, value2);
            oldcount = value2;
            return {
              key: key2,
              count: Number(value2),
              conversionRate,

              metadataName: item.metadataName,
              metadataCode: item.metadataCode,
              customName: item.customName
            };
          });

          return {
            time: key,
            conversionRateMap: this.computedConversionRateMap(steps, stepLength, topStepData.key, rootStepData.key),
            steps
          };
        })
        .sort((n, m) => (n.time > m.time ? 1 : -1))
    });
    return result.reverse();
  }

  public async funnelAnalyse(param: any): Promise<IFunnelData> {
    const globalFilterStr = filterToQuery(param.filter);
    const timeParam = getDynamicTime(param.dateStart, param.dateEnd, param.dateType);
    const dimensionMap = {};
    const metadataMap = {};
    const queryData: IFunnelQueryDataItem[] = [];
    const result: IFunnelData = {
      dimension: param.dimension,
      dimensionValues: [],
      type: param.type,
      conversionRate: 0,
      list: []
    };

    const select = this.getSelect(param.indicatorType, param.type, 'day', param.dimension);

    for (let indicator of param.indicators) {
      const indicatorFilterStr = filterToQuery(indicator.filter);
      const metadataStr = indicator.metadataCode ? `and trackId:${indicator.trackId}` : '';
      const filterStr = `${globalFilterStr} ${indicatorFilterStr} projectId:${param.projectId} ${metadataStr} `;
      // tslint:disable-next-line: max-line-length
      const query = `${filterStr} |${select}`;

      const metadata = indicator.metadataCode
        ? await this.metadataService.getMetadataByCode(indicator.metadataCode, param.projectId)
        : { code: '_ALL_METADATA', name: '所有事件' };

      const data = await this.slsService.query<IAnalyseQueryDataItem>({
        query,
        from: Math.floor(timeParam.dateStart / 1000),
        to: Math.floor(timeParam.dateEnd / 1000)
      });
      if (param.dimension) {
        data.forEach(item => {
          dimensionMap[item[param.dimension]] = true;
        });
      }
      //生成唯一key
      if (typeof metadataMap[metadata.code] === 'undefined') {
        metadataMap[metadata.code] = 0;
      } else {
        metadataMap[metadata.code]++;
      }

      queryData.push({
        key: metadataMap[metadata.code] ? metadata.code + '__' + metadataMap[metadata.code] : metadata.code,
        metadataCode: metadata.code,
        metadataName: metadata.name,
        customName: indicator.customName,
        count: data.reduce((total, item) => (total += Number(item.count)), 0),
        data
      });
    }
    if (queryData.length > 1) {
      result.conversionRate = this.computedRate(queryData[0].count, queryData[queryData.length - 1].count);
    }

    result.list = this.getFunnelListData(queryData, result.dimension);

    return result;
  }

  public async eventAnalyse(param: QueryEventAnalyseDataDto): Promise<any> {
    const globalFilterStr = filterToQuery(param.filter);

    const timeParam = getDynamicTime(param.dateStart, param.dateEnd, param.dateType);

    const dimensionMap = {};
    const metadataMap = {};

    const group = param.dimension
      ? `,${param.dimension} GROUP BY time, ${param.dimension} ORDER BY time`
      : 'group by time order by time';

    const result = {
      list: [],
      dimension: param.dimension,
      dimensionValues: [],
      timeUnit: param.timeUnit,
      type: param.type
    };

    for (let indicator of param.indicators) {
      const indicatorFilterStr = filterToQuery(indicator.filter);

      const metadataStr = indicator.metadataCode ? `and trackId:${indicator.trackId}` : '';
      const filterStr = `${globalFilterStr} ${indicatorFilterStr} projectId:${param.projectId} ${metadataStr} `;
      // tslint:disable-next-line: max-line-length
      const query = `${filterStr} | select date_trunc('${param.timeUnit.toLowerCase()}', trackTime) as time , count(1) as pv, approx_distinct(utoken) as uv ${group} limit 1000`;

      const metadata = indicator.metadataCode
        ? await this.metadataService.getMetadataByCode(indicator.metadataCode, param.projectId)
        : { code: '', name: '所有事件' };

      const data = await this.slsService.query({
        query,
        from: Math.floor(timeParam.dateStart / 1000),
        to: Math.floor(timeParam.dateEnd / 1000)
      });
      if (param.dimension) {
        data.forEach(item => {
          dimensionMap[item[param.dimension]] = true;
        });
      }

      if (typeof metadataMap[indicator.trackId] === 'undefined') {
        metadataMap[indicator.trackId] = false;
      } else {
        metadataMap[indicator.trackId] = true;
      }

      const compare = await this.diff(filterStr, timeParam);

      result.list.push({
        key: metadataMap[indicator.trackId] ? indicator.trackId + Date.now() : indicator.trackId,
        trackId: indicator.trackId,
        metadataCode: metadata.code,
        metadataName: metadata.name,
        data,
        compare
      });
    }
    result.dimensionValues = Object.keys(dimensionMap);
    return result;
  }
}
