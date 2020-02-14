import { SlsService } from '@/providers/sls/sls.service';
import { Injectable } from '@nestjs/common';
import { QueryEventAnalyseDataDto } from './analyse.dto';
import { filterToQuery } from './analyse.util';
import { getDynamicTime } from '@/utils/date';
import { MetadataService } from '../metadata/metadata.service';

@Injectable()
export class AnalyseService {
  constructor(private readonly slsService: SlsService, private readonly metadataService: MetadataService) {}

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

  public async eventAnalyse(param: QueryEventAnalyseDataDto): Promise<any> {
    const globalFilterStr = filterToQuery(param.filter);

    const timeParam = getDynamicTime(
      new Date(param.time.date[0] || '').getTime(),
      new Date(param.time.date[1] || '').getTime(),
      param.time.type
    );

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
