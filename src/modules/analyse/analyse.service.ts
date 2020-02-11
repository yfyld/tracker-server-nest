import { SlsService } from '@/providers/sls/sls.service';
import { Injectable } from '@nestjs/common';
import { QueryEventAnalyseDataDto } from './analyse.dto';
import { filterToQuery, timeUtilToParam } from './analyse.util';
import { getDynamicTime } from '@/utils/date';

@Injectable()
export class AnalyseService {
  constructor(private readonly slsService: SlsService) {}
  public async eventAnalyse(param: QueryEventAnalyseDataDto): Promise<any> {
    const filterStr = filterToQuery(param.filter);
    const timeUtilParam = timeUtilToParam(param.timeUlit);

    const timeParam = getDynamicTime(
      new Date(param.time.date[0]).getTime(),
      new Date(param.time.date[1]).getTime(),
      param.time.type
    );

    const group = param.dimension
      ? `,${param.dimension} GROUP BY time, ${param.dimension} ORDER BY time`
      : 'group by time order by time';

    const result = {};

    for (let indicator of param.indicators) {
      const indicatorFilterStr = filterToQuery(indicator.filter);
      // tslint:disable-next-line: max-line-length
      const query = `${filterStr} ${indicatorFilterStr} projectId:${param.projectId} and trackId:${indicator.trackId}  | select time_series(trackTime, '${timeUtilParam.window}', '${timeUtilParam.format}' ,'0') as time, count(1) as pv, approx_distinct(utoken) as uv ${group} limit 10`;

      console.log(query, timeParam);
      result[indicator.trackId] = await this.slsService.query({
        query,
        from: Math.floor(timeParam.dateStart / 1000),
        to: Math.floor(timeParam.dateEnd / 1000)
      });
    }

    return result;
  }
}
