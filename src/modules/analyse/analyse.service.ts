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

  private getGroup(dimension: string, hasTime: boolean) {
    if (dimension && !hasTime) {
      return `,${dimension}  GROUP BY time ${dimension}`;
    } else if (dimension && hasTime) {
      return `,${dimension} GROUP BY time, ${dimension} ORDER BY time`;
    } else if (hasTime) {
      return ` group by time order by time`;
    } else {
      return ``;
    }
  }

  private getSelect(indicatorType: string, showType: string, timeUnit = 'day', demension = '') {
    const key = [];
    let hasTime = false;
    const isTrend = showType === 'LINE' || showType === 'BAR' || showType === 'TABLE';
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

  private getConversionRate(list: { count: number }[]) {
    if (list.length === 1) {
      return 100;
    } else if (Number(list[0].count) === 0 || Number(list[list.length - 1].count) === 0) {
      return 0;
    } else {
      return Math.floor((Number(list[list.length - 1].count) / Number(list[0].count)) * 100);
    }
  }

  public async funnelAnalyse(param: any): Promise<any> {
    const globalFilterStr = filterToQuery(param.filter);
    const timeParam = getDynamicTime(param.dateStart, param.dateEnd, param.dateType);
    const dimensionMap = {};
    const metadataMap = {};
    const result = {
      list: [],
      dimension: param.dimension,
      dimensionValues: [],
      type: param.type,
      conversionRate: 0
    };

    const select = this.getSelect(param.indicatorType, param.type, 'day');

    for (let indicator of param.indicators) {
      const indicatorFilterStr = filterToQuery(indicator.filter);
      const metadataStr = indicator.metadataCode ? `and trackId:${indicator.trackId}` : '';
      const filterStr = `${globalFilterStr} ${indicatorFilterStr} projectId:${param.projectId} ${metadataStr} `;
      // tslint:disable-next-line: max-line-length
      const query = `${filterStr} |${select}`;

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
      //生成唯一key
      if (typeof metadataMap[indicator.metadataCode] === 'undefined') {
        metadataMap[indicator.metadataCode] = 0;
      } else {
        metadataMap[indicator.metadataCode]++;
      }

      result.list.push({
        key: metadataMap[indicator.metadataCode]
          ? indicator.metadataCode + '__' + metadataMap[indicator.metadataCode]
          : indicator.metadataCode,
        metadataCode: metadata.code,
        metadataName: metadata.name,
        customName: indicator.customName,
        count: data.reduce((total, item) => (total += Number(item.count)), 0),
        data
      });
    }
    result.conversionRate = this.getConversionRate(result.list);

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
