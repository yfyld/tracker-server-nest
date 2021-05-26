import { IAnalyseEventData, IAnalyseEventDataListDataItem, ICompare } from './analyse.interface';
import { SlsService } from '@/providers/sls/sls.service';
import { Injectable } from '@nestjs/common';
import { QueryEventAnalyseDataDto } from './analyse.dto';
import { filterToQuery, getGroup, getProjectFilter } from './analyse.util';
import { getDynamicTime } from '@/utils/date';
import { MetadataService } from '../metadata/metadata.service';
import { ProjectService } from '../project/project.service';

@Injectable()
export class AnalyseEventService {
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
    const window = Math.round((timeParam.dateEnd - timeParam.dateStart) / 1000);

    const day = Math.round(window / 86400);

    let countStr = 'select approx_distinct(id) as count';
    if (indicatorType === 'PV') {
      countStr = `select approx_distinct(id) as count`;
    } else if (indicatorType === `UV`) {
      countStr = `select approx_distinct (deviceId) as count`;
    } else if (indicatorType === 'APV') {
      countStr = `select try(approx_distinct(id) / approx_distinct (deviceId)) as count`;
    } else if (indicatorType === `RUV`) {
      countStr = `select approx_distinct (uid) as count`;
    } else if (indicatorType === 'RAPV') {
      countStr = `select try(approx_distinct(id) / approx_distinct (uid)) as count`;
    } else if (indicatorType === 'DPV') {
      countStr = `select approx_distinct(id) / ${day || 1} as count`;
    } else if (indicatorType === 'DUV') {
      countStr = `select try(approx_distinct (deviceId) / ${day || 1} )as count`;
    } else if (indicatorType === 'DRUV') {
      countStr = `select try(approx_distinct (uid) / ${day || 1} )as count`;
    }

    // tslint:disable-next-line:max-line-length
    const qoqQuery = `${filers}|select qoq[1] as qoqCurrent, qoq[2] as qoqPrev, qoq[3] as qoqPercentage from(select  compare( count , ${window}) as qoq   from (${countStr}  from log ))`;
    const yoyQuery = `${filers}|select  yoy[1] as yoyCurrent, yoy[2] as yoyPrev, yoy[3] as yoyPercentage from( select compare( count , ${86400 *
      30}) as yoy  from (${countStr}  from log ))`;

    const [qoqData, yoyData] = await Promise.all([
      this.slsService.query<ICompare>({
        query: qoqQuery,
        from: timeParam.dateStart,
        to: timeParam.dateEnd
      }),
      this.slsService.query<ICompare>({
        query: yoyQuery,
        from: timeParam.dateStart,
        to: timeParam.dateEnd
      })
    ]);

    return {
      qoqCurrent: Number(qoqData[0].qoqCurrent),
      qoqPrev: Number(qoqData[0].qoqPrev),
      qoqPercentage: Number(qoqData[0].qoqPercentage),
      yoyCurrent: Number(yoyData[0].yoyCurrent),
      yoyPrev: Number(yoyData[0].yoyPrev),
      yoyPercentage: Number(yoyData[0].yoyPercentage)
    };
  }

  private getEventSelect(indicatorType: string, showType: string, timeUnit = 'day', dimension = '') {
    const key = [];
    let hasTime = false;
    const isTrend = showType === 'LINE' || showType === 'BAR' || showType === 'TABLE';
    if (indicatorType === 'PV' || indicatorType === 'DPV') {
      key.push(`approx_distinct(id) as count`);
    } else if (indicatorType === `UV` || indicatorType === 'DUV') {
      key.push(`approx_distinct (deviceId) as count`);
      // key.push(`approx_distinct(CASE   WHEN uid='-1'  then utoken  ELSE uid end  ) as count`);
    } else if (indicatorType === `RUV` || indicatorType === 'DRUV') {
      key.push(`approx_distinct (uid) as count`);
    } else if (indicatorType === 'APV') {
      key.push(`try(approx_distinct(id) / approx_distinct (deviceId)) as count`);
    } else if (indicatorType === 'RAPV') {
      key.push(`try(approx_distinct(id) / approx_distinct (uid)) as count`);
    }
    if (indicatorType === 'DRUV' || indicatorType === 'DUV' || indicatorType === 'DPV') {
      key.push(`date_format(trackTime/1000,'%H') as time`);
      hasTime = true;
    } else if (isTrend) {
      key.push(`date_trunc('${timeUnit.toLowerCase()}', trackTime/1000) as time`);
      hasTime = true;
    }
    const group = getGroup(dimension, hasTime);
    return ' select ' + key.join(',') + group + ' limit 1000';
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
      dimension: param.dimension.replace(/(^dimension).*/, '$1'),
      dimensionValues: [],
      timeUnit: param.timeUnit,
      type: param.type
    };

    for (let indicator of param.indicators) {
      const select = this.getEventSelect(indicator.type, param.type, param.timeUnit, param.dimension);
      const indicatorFilterStr = filterToQuery(indicator.filter);

      const metadataStr = indicator.metadataCode !== '_ALL_METADATA' ? `and trackId:${indicator.metadataCode}` : '';
      const filterStr = `${globalFilterStr} ${indicatorFilterStr} ${getProjectFilter(
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
        from: timeParam.dateStart,
        to: timeParam.dateEnd
      });
      param.dimension = param.dimension.replace(/(^dimension).*/, '$1');
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
        metadataName: indicator.customName || indicator.metadataName || metadata.name,
        indicatorType: indicator.type,
        data,
        compare
      });
    }
    result.dimensionValues = Object.keys(dimensionMap);
    return result;
  }
}
