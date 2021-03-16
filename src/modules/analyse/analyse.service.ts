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

import * as sk from '@91jkys/service-kit';

async function test() {
  try {
    console.log(await sk.request('clitest.TestService:1.0', 'hello', ['test data']));
  } catch (error) {
    console.error(error);
  }
}

test();
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
      countStr = `select approx_distinct (coalesce(uid ,utoken)) as count`;
    } else if (indicatorType === 'APV') {
      countStr = `select try(count(1) / approx_distinct (coalesce(uid ,utoken))) as count`;
    } else if (indicatorType === `RUV`) {
      countStr = `select approx_distinct (coalesce(uid ,utoken)) as count`;
    } else if (indicatorType === 'RAPV') {
      countStr = `select try(count(1) / approx_distinct (coalesce(uid ,utoken))) as count`;
    } else if (indicatorType === 'DPV') {
      countStr = `select count(1) / ${day} as count`;
    } else if (indicatorType === 'DUV') {
      countStr = `select try(approx_distinct (coalesce(uid ,utoken)) / ${day} )as count`;
    } else if (indicatorType === 'DRUV') {
      countStr = `select try(approx_distinct (coalesce(uid ,utoken)) / ${day} )as count`;
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

    const data = await this.slsService.query({
      query,
      from: timeParam.dateStart,
      to: timeParam.dateEnd
    });
    return data;
  }

  private async getUserTimeData(param: QueryUserTimelineAnalyseDataDto) {
    const timeParam = getDynamicTime(param.dateStart, param.dateEnd, param.dateType);
    let query = `projectId:${param.projectId} ${param.deviceId ? 'and deviceId:' + param.deviceId : ''}  ${
      param.ip ? 'and ip:' + param.ip : ''
    } ${param.custom ? 'and custom:' + param.custom : ''} ${
      param.uid ? 'and uid:' + param.uid : ''
      // tslint:disable-next-line: max-line-length
    }| select url,os,version,appid,browser,browserVersion, deviceId,trackId,trackTime,durationTime,pageId,actionType,deviceModel,ip,ua,title,custom order by trackTime asc limit 1000`;

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

    if (!data.length) {
      return [];
    }

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
      } else if (!item.actionType || item.actionType === 'null' || item.actionType === 'EVENT') {
        //!item.actionType  临时兼容老日志信息不全
        total.push(item);
      } else if (item.actionType === 'DURATION' && prevPage && item.pageId === prevPage.trackId) {
        prevPage.durationTime = item.durationTime;
        prevPage = null;
      }
      return total;
    }, []);
  }

  async userTimeAnalyse(param: QueryUserTimelineAnalyseDataDto) {
    const result = { list: [] };
    if (param.uid || param.deviceId) {
      result.list.push({ userTime: await this.getUserTimeData(param), user: param.uid || param.deviceId });
    } else {
      const timeParam = getDynamicTime(param.dateStart, param.dateEnd, param.dateType);

      const deviceIds = await this.slsService.query<{ deviceId: string }>({
        query: `projectId:${param.projectId} ${param.ip ? 'and ip:' + param.ip : ''} ${
          param.custom ? 'and custom:' + param.custom : ''
        } | select deviceId group by deviceId`,
        from: timeParam.dateStart,
        to: timeParam.dateEnd
      });
      if (deviceIds.length === 1) {
        result.list.push({ userTime: await this.getUserTimeData(param), user: deviceIds[0].deviceId });
      } else if (deviceIds.length >= 10) {
        throw new Error('超过了10个用户');
      } else {
        for (let item of deviceIds) {
          result.list.push({
            userTime: await this.getUserTimeData({ ...param, deviceId: item.deviceId }),
            user: item.deviceId
          });
        }
      }
    }

    return result;
  }
}
