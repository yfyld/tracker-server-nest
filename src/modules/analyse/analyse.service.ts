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
import {
  QueryEventAnalyseDataDto,
  QueryFunnelAnalyseDataDto,
  QueryPathAnalyseDataDto,
  QueryCustomAnalyseDataDto,
  QueryUserTimelineAnalyseDataDto
} from './analyse.dto';
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
    } else if (indicatorType === `RUV`) {
      countStr = `select approx_distinct(uid) as count`;
    } else if (indicatorType === 'RAPV') {
      countStr = `select try(count(1) / approx_distinct(uid)) as count`;
    } else if (indicatorType === 'DPV') {
      countStr = `select count(1) / ${day} as count`;
    } else if (indicatorType === 'DUV') {
      countStr = `select try(approx_distinct(utoken) / ${day} )as count`;
    } else if (indicatorType === 'DRUV') {
      countStr = `select try(approx_distinct(uid) / ${day} )as count`;
    }

    // tslint:disable-next-line:max-line-length
    const qoqQuery = `${filers}|select qoq[1] as qoqCurrent, qoq[2] as qoqPrev, qoq[3] as qoqPercentage from(select  compare( count , ${window}) as qoq   from (${countStr}  from log ))`;
    const yoyQuery = `${filers}|select  yoy[1] as yoyCurrent, yoy[2] as yoyPrev, yoy[3] as yoyPercentage from( select compare( count , ${86400 *
      365}) as yoy  from (${countStr}  from log ))`;

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

  async customAnalyse(param: QueryCustomAnalyseDataDto) {
    const timeParam = getDynamicTime(param.dateStart, param.dateEnd, param.dateType);
    let query = `projectId:${param.projectId}`;
    if (param.query) {
      const queryArr = param.query.split('|');
      query = queryArr.length > 1 ? `${query} and (${queryArr[0]}) | ${queryArr[1]}` : `${query} and (${param.query})`;
    }

    return await this.slsService.query({
      query,
      from: timeParam.dateStart,
      to: timeParam.dateEnd
    });
  }

  async userTimeAnalyse(param: QueryUserTimelineAnalyseDataDto) {
    const timeParam = getDynamicTime(param.dateStart, param.dateEnd, param.dateType);
    let query = `projectId:${param.projectId} ${param.utoken ? 'and utoken:' + param.utoken : ''} ${
      param.uid ? 'and uid:' + param.uid : ''
    }| select url,os,version,appid,browser, trackId,trackTime,durationTime,pageId,actionType order by trackTime asc`;

    const data = await this.slsService.query<{
      trackId: string;
      trackTime: number;
      durationTime: number;
      pageId: string;
      actionType: string;
      trackName: string;
      pageName: string;
    }>({
      query,
      from: timeParam.dateStart,
      to: timeParam.dateEnd
    });

    let trackIdMap = {};
    data.forEach(item => {
      if (item.trackId) {
        trackIdMap[item.trackId] = item.trackId;
      }
      if (item.pageId) {
        trackIdMap[item.pageId] = item.pageId;
      }
    });

    const metadatas = await this.metadataService.getMetadatasByCodes(Object.keys(trackIdMap));
    metadatas.forEach(item => {
      trackIdMap[item.code] = item.name;
    });

    let prevPage = null;
    return data.reduce((total, item) => {
      item.durationTime = item.durationTime && Number(item.durationTime);
      item.trackName = trackIdMap[item.trackId];
      item.pageName = trackIdMap[item.pageId];

      if (item.actionType === 'PAGE') {
        total.push(item);
        prevPage = item;
      } else if (item.actionType === 'EVENT') {
        total.push(item);
      } else if (item.actionType === 'DURATION' && prevPage && item.pageId === prevPage.trackId) {
        prevPage.durationTime = item.durationTime;
        prevPage = null;
      }
      return total;
    }, []);
  }
}
