import {
  IFunnelQueryDataItem,
  IFunnelData,
  IAnalyseQueryDataItem,
  IFunnelDataByDimensionItem,
  IAnalyseEventData,
  IAnalyseEventDataListDataItem,
  ICompare,
  IPathData,
  IIndicatorInfo
} from './analyse.interface';
import { SlsService } from '@/providers/sls/sls.service';
import { Injectable } from '@nestjs/common';
import { QueryEventAnalyseDataDto, QueryFunnelAnalyseDataDto, QueryPathAnalyseDataDto } from './analyse.dto';
import { filterToQuery } from './analyse.util';
import { getDynamicTime } from '@/utils/date';
import { MetadataService } from '../metadata/metadata.service';
import { ProjectService } from '../project/project.service';

@Injectable()
export class AnalyseService {
  constructor(
    private readonly slsService: SlsService,
    private readonly metadataService: MetadataService,
    private readonly projectService: ProjectService
  ) {}
  /**
   *
   * @param 过滤条件
   * @param 时间
   * 环比同比
   */
  public async diff(filers: string, timeParam, indicatorType: string): Promise<ICompare> {
    const window = Math.floor((timeParam.dateEnd - timeParam.dateStart) / 1000);

    const day = Math.floor(window / 86400);

    let countStr = 'select count(1) as count';
    if (indicatorType === 'PV') {
      countStr = `select count(1) as count`;
    } else if (indicatorType === `UV`) {
      countStr = `select approx_distinct(utoken) as count`;
    } else if (indicatorType === 'APV') {
      countStr = `select try(count(1) / approx_distinct(utoken)) as count`;
    } else if (indicatorType === 'DPV') {
      countStr = `select count(1) / ${day} as count`;
    } else if (indicatorType === 'DUV') {
      countStr = `select try(approx_distinct(utoken) / ${day} )as count`;
    }

    // tslint:disable-next-line:max-line-length
    const query = `${filers}|select qoq[1] as qoqCurrent, qoq[2] as qoqPrev, qoq[3] as qoqPercentage, yoy[1] as yoyCurrent, yoy[2] as yoyPrev, yoy[3] as yoyPercentage from(select  compare( count , ${window}) as qoq ,compare( count , ${window +
      86400 * 365}) as yoy  from (${countStr}  from log ))`;
    const data = await this.slsService.query<ICompare>({
      query,
      from: Math.floor(timeParam.dateStart / 1000),
      to: Math.floor(timeParam.dateEnd / 1000)
    });
    for (let i in data[0]) {
      data[0][i] = Number(data[0][i]);
    }
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
  private getFunnelSelect(indicatorType: string, showType: string, timeUnit = 'day', demension = '') {
    const key = [];
    let hasTime = false;
    const isTrend = showType === 'LINE' || showType === 'BAR' || showType === 'TABLE' || showType === 'LIST';
    if (indicatorType === 'PV' || indicatorType === 'DPV') {
      key.push(`count(1) as count`);
    } else if (indicatorType === `UV` || indicatorType === 'DUV') {
      key.push(`approx_distinct(utoken) as count`);
    } else if (indicatorType === 'APV') {
      key.push(`try(count(1) / approx_distinct(utoken)) as count`);
    }

    if (indicatorType === 'DUV' || indicatorType === 'DPV') {
      key.push(`date_format(trackTime,'%H') as time`);
      hasTime = true;
    } else if (isTrend) {
      key.push(`date_trunc('${timeUnit.toLowerCase()}', trackTime/1000) as time`);
      hasTime = true;
    }
    const group = this.getGroup(demension, hasTime);
    return ' select ' + key.join(',') + group + ' limit 1000';
  }

  /**
   * 计算百分比
   * @param all
   * @param part
   */
  private computedRate(all: number, part: number) {
    if (!all) {
      return null;
    } else {
      return Math.floor((part / all) * 100);
    }
  }

  /**
   * 计算总转化率
   * @param steps
   * @param stepLength
   * @param topKey
   * @param rootKey
   */
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

  /**
   * queryList 转 deimension>time>steps 格式
   * @param list
   * @param dimension
   */
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
      dimension: '总体',
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
            conversionRateMap: this.computedConversionRateMap(steps, steps.length, topStepData.key, rootStepData.key),
            steps
          };
        })
        .sort((n, m) => (n.time > m.time ? 1 : -1))
    });
    return result.reverse();
  }

  /**
   * 漏斗分析service
   * @param QueryFunnelAnalyseDataDto
   */
  public async funnelAnalyse(param: QueryFunnelAnalyseDataDto): Promise<IFunnelData> {
    //全家过滤
    const globalFilterStr = filterToQuery(param.filter);

    const timeParam = getDynamicTime(param.dateStart, param.dateEnd, param.dateType);

    const dimensionMap = {};
    const metadataMap = {};
    //查询结果
    const queryData: IFunnelQueryDataItem[] = [];

    //返回结果初始化
    const result: IFunnelData = {
      dimension: param.dimension,
      dimensionValues: [],
      type: param.type,
      conversionRate: 0,
      indicatorType: param.indicatorType,
      list: []
    };

    const associationProjectIds = await this.projectService.getAssociationProjectIds(param.projectId);

    const select = this.getFunnelSelect(param.indicatorType, param.type, 'day', param.dimension);

    for (let indicator of param.indicators) {
      const indicatorFilterStr = filterToQuery(indicator.filter);
      const metadataStr = indicator.metadataCode !== '_ALL_METADATA' ? `and trackId:${indicator.metadataCode}` : '';
      const filterStr = `${globalFilterStr} ${indicatorFilterStr} ${this.getProjectFilter(
        param.projectId,
        indicator.projectId,
        associationProjectIds
      )} ${metadataStr} `;
      // tslint:disable-next-line: max-line-length
      const query = `${filterStr} |${select}`;

      const metadata =
        indicator.metadataCode === '_ALL_METADATA'
          ? { code: '_ALL_METADATA', name: '所有事件' }
          : await this.metadataService.getMetadataByCode(indicator.metadataCode, param.projectId);

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

  private getEventSelect(indicatorType: string, showType: string, timeUnit = 'day', dimension = '') {
    const key = [];
    let hasTime = false;
    const isTrend = showType === 'LINE' || showType === 'BAR' || showType === 'TABLE';
    if (indicatorType === 'PV' || indicatorType === 'DPV') {
      key.push(`count(1) as count`);
    } else if (indicatorType === `UV` || indicatorType === 'DUV') {
      key.push(`approx_distinct(utoken) as count`);
    } else if (indicatorType === 'APV') {
      key.push(`try(count(1) / approx_distinct(utoken)) as count`);
    }
    if (indicatorType === 'DUV' || indicatorType === 'DPV') {
      key.push(`date_format(trackTime,'%H') as time`);
      hasTime = true;
    } else if (isTrend) {
      key.push(`date_trunc('${timeUnit.toLowerCase()}', trackTime/1000) as time`);
      hasTime = true;
    }
    const group = this.getGroup(dimension, hasTime);
    return ' select ' + key.join(',') + group + ' limit 1000';
  }

  private getProjectFilter(projectId: number, associationProjectId: number, associationProjectIds: number[]) {
    if (projectId && (!associationProjectIds.length || associationProjectId === projectId || !associationProjectId)) {
      return ` projectId:${projectId} `;
    }

    if (associationProjectIds.length && associationProjectId && associationProjectIds.includes(associationProjectId)) {
      return ` projectId:${associationProjectId} `;
    }

    if (associationProjectIds.length && !associationProjectId) {
      return associationProjectIds.map(item => ` projectId:${item} `).join(' and ');
    }
    throw '当前分析终数据不存在或无权限';
  }

  /**
   * 事件分析service
   * @param param
   */
  public async eventAnalyse(param: QueryEventAnalyseDataDto): Promise<IAnalyseEventData> {
    //全局过滤
    const globalFilterStr = filterToQuery(param.filter);

    const timeParam = getDynamicTime(param.dateStart, param.dateEnd, param.dateType);

    const dimensionMap = {};
    const metadataMap = {};

    const associationProjectIds = await this.projectService.getAssociationProjectIds(param.projectId);

    const result: IAnalyseEventData = {
      list: [],
      dimension: param.dimension,
      dimensionValues: [],
      timeUnit: param.timeUnit,
      type: param.type
    };

    for (let indicator of param.indicators) {
      const select = this.getEventSelect(indicator.type, param.type, param.timeUnit, param.dimension);
      const indicatorFilterStr = filterToQuery(indicator.filter);

      const metadataStr = indicator.metadataCode !== '_ALL_METADATA' ? `and trackId:${indicator.metadataCode}` : '';
      const filterStr = `${globalFilterStr} ${indicatorFilterStr} ${this.getProjectFilter(
        param.projectId,
        indicator.projectId,
        associationProjectIds
      )} ${metadataStr} `;
      // tslint:disable-next-line: max-line-length
      const query = `${filterStr} | ${select}`;

      const metadata =
        indicator.metadataCode !== '_ALL_METADATA'
          ? await this.metadataService.getMetadataByCode(indicator.metadataCode, indicator.projectId || param.projectId)
          : { code: '_ALL_METADATA', name: '所有事件' };

      const data = await this.slsService.query<IAnalyseEventDataListDataItem>({
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

      const compare = await this.diff(filterStr, timeParam, indicator.type);

      result.list.push({
        key: metadataMap[metadata.code] ? metadata.code + '__' + metadataMap[metadata.code] : metadata.code,
        metadataCode: metadata.code,
        metadataName: metadata.name,
        indicatorType: indicator.type,
        data,
        compare
      });
    }
    result.dimensionValues = Object.keys(dimensionMap);
    return result;
  }

  /**
   * 路径分析service
   * @param QueryPathAnalyseDataDto
   */
  public async pathAnalyse(param: QueryPathAnalyseDataDto): Promise<IPathData> {
    //全家过滤
    const globalFilterStr = filterToQuery(param.filter);

    const timeParam = getDynamicTime(param.dateStart, param.dateEnd, param.dateType);

    //返回结果初始化
    const result: IPathData = {
      data: [],
      links: [],
      indicatorType: param.indicatorType
    };

    const associationProjectIds = await this.projectService.getAssociationProjectIds(param.projectId);

    const select = 'select count(*) as count';

    //查询所有页面
    const indicatorSqlMap: { [prop: string]: string } = {};
    const indicatorMap: { [prop: string]: { id: string; value: number; name: string } } = {};
    for (let indicator of param.indicators) {
      const indicatorFilterStr = filterToQuery(indicator.filter);
      const metadataStr = indicator.metadataCode !== '_ALL_METADATA' ? `and trackId:${indicator.metadataCode}` : '';
      const filterStr = `${globalFilterStr} ${indicatorFilterStr} ${this.getProjectFilter(
        param.projectId,
        indicator.projectId,
        associationProjectIds
      )} ${metadataStr} `;
      const query = `${filterStr} |${select}`;

      indicatorSqlMap[indicator.id] = query;

      const data = await this.slsService.query<any>({
        query,
        from: Math.floor(timeParam.dateStart / 1000),
        to: Math.floor(timeParam.dateEnd / 1000)
      });

      const item = {
        id: indicator.id,
        name: indicator.customName || indicator.metadataName,
        value: Number(data[0].count)
      };

      result.data.push(item);
      indicatorMap[indicator.id] = item;
    }

    //查询父到子
    for (let pageData of param.childPageData) {
      for (let pageInfo of pageData.children) {
        const indicatorSql = indicatorSqlMap[pageInfo.id];
        const childrenFilterStr = filterToQuery(pageInfo.filter);
        const query = `${childrenFilterStr}${indicatorSql}`;
        const data = await this.slsService.query<any>({
          query,
          from: Math.floor(timeParam.dateStart / 1000),
          to: Math.floor(timeParam.dateEnd / 1000)
        });

        result.links.push({
          source: pageData.parentId,
          target: pageInfo.id,
          sourceName: indicatorMap[pageData.parentId].name,
          targetName: indicatorMap[pageInfo.id].name,
          conversionRate: indicatorMap[pageData.parentId].value
            ? Math.floor((data[0].count / indicatorMap[pageData.parentId].value) * 100)
            : 0,
          value: Number(data[0].count)
        });
      }
    }

    return result;
  }
}
