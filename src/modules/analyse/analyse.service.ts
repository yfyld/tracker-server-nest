import { SlsService } from '@/providers/sls/sls.service';
import { Injectable } from '@nestjs/common';
import { QueryEventAnalyseDataDto } from './analyse.dto';
import { filterToQuery } from './analyse.util';
import { getDynamicTime } from '@/utils/date';
import { MetadataService } from '../metadata/metadata.service';

@Injectable()
export class AnalyseService {
  constructor(private readonly slsService: SlsService, private readonly metadataService: MetadataService) {}
  public async eventAnalyse(param: QueryEventAnalyseDataDto): Promise<any> {
    const filterStr = filterToQuery(param.filter);

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

    const result = { list: [], dimension: param.dimension, dimensionValues: [] };

    for (let indicator of param.indicators) {
      const indicatorFilterStr = filterToQuery(indicator.filter);

      const metadataStr = indicator.metadataCode ? `and trackId:${indicator.trackId}` : '';
      // tslint:disable-next-line: max-line-length
      const query = `${filterStr} ${indicatorFilterStr} projectId:${
        param.projectId
        // tslint:disable-next-line: max-line-length
      } ${metadataStr}  | select date_trunc('${param.timeUlit.toLowerCase()}', trackTime) as time, count(1) as pv, approx_distinct(utoken) as uv ${group} limit 1000`;

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

      result.list.push({
        key: metadataMap[indicator.trackId] ? indicator.trackId + Date.now() : indicator.trackId,
        trackId: indicator.trackId,
        metadataCode: metadata.code,
        metadataName: metadata.name,
        data
      });
    }
    result.dimensionValues = Object.keys(dimensionMap);
    return result;
  }
}
