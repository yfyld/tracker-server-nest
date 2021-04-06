import { CheckoutService } from './../checkout/checkout.service';
import { ChannelService } from './../channel/channel.service';
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
  QueryUserTimelineAnalyseDataDto,
  QueryCheckoutAnalyseDataDto
} from './analyse.dto';
import { clearNullStr, filterToQuery } from './analyse.util';
import { getDynamicTime } from '@/utils/date';
import { MetadataService } from '../metadata/metadata.service';
import { ProjectService } from '../project/project.service';

import * as sk from '@91jkys/service-kit';
import { SlsF2eService } from '@/providers/sls/sls.f2e.service';

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
    private readonly slsF2eService: SlsF2eService,

    private readonly metadataService: MetadataService,
    private readonly checkoutService: CheckoutService,
    private readonly channelService: ChannelService,
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
    } ${param.custom ? 'and custom:' + param.custom : ''} ${param.id ? 'and id:' + param.id : ''} ${
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

      const deviceIds = await this.slsF2eService.query<{ deviceId: string }>({
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

  async checkoutAnalyse(param: QueryCheckoutAnalyseDataDto) {
    if (param.uid || param.deviceId) {
      return await this.getCheckoutData(param);
    } else {
      const timeParam = getDynamicTime(param.dateStart, param.dateEnd, param.dateType);

      const deviceIds = await this.slsService.query<{ deviceId: string }>({
        query: `${[
          param.ip && 'ip:' + param.ip,
          param.appId && 'appId:' + param.appId,
          param.sessionId && 'sessionId:' + param.sessionId,
          param.channel && 'channel:' + param.channel,
          param.custom && 'custom:' + param.custom,
          param.slsquery && param.slsquery
        ]
          .filter(item => !!item)
          .join(' and ')}| select deviceId group by deviceId`,
        from: timeParam.dateStart,
        to: timeParam.dateEnd
      });
      if (deviceIds.length !== 1) {
        throw new Error('超过了1个用户');
      } else {
        param.deviceId = deviceIds[0].deviceId;
      }
      return await this.getCheckoutData(param);
    }
  }

  async getCheckoutData(param: QueryCheckoutAnalyseDataDto) {
    const timeParam = getDynamicTime(param.dateStart, param.dateEnd, param.dateType);
    let query = `${[
      param.ip && 'ip:' + param.ip,
      param.appId && 'appId:' + param.appId,
      param.sessionId && 'sessionId:' + param.sessionId,
      param.channel && 'channel:' + param.channel,
      param.custom && 'custom:' + param.custom,
      param.slsquery && param.slsquery,
      param.deviceId && param.deviceId,
      param.uid && param.uid,
      param.projectId && param.projectId
    ]
      .filter(item => !!item)
      .join(' and ')}| select ${[
      'id',
      // 'debug',
      'actionType',
      'trackId',
      'startTime',
      'durationTime',
      'trackTime',
      'libVersion',
      'libType',
      'version',
      // 'appVersion',
      'url',
      'title',
      'eventName',
      'domPath',
      'netType',
      'clientWidth',
      'clientHeight',
      'radio',
      'engineVersion',
      'os',
      'osVersion',
      'deviceType',
      'browser',
      'browserVersion',
      'engine',
      'deviceManufacturer',
      'deviceModel',
      'deviceId',
      'product',
      'deviceBrand',
      'supportedAbi',
      'androidSdkInt',
      'isPhysicalDevice',
      'custom',
      'uid',
      'isLogin',
      // 'contentId',
      // 'patientId',
      // 'doctorId',
      // 'skuId',
      // 'prescriptionId',
      // 'storeId',
      // 'inquiryId',
      // 'orderId',
      // 'activityId',
      // 'bizId',
      // 'masterId',
      'pageId',
      'referrerId',
      'referrerUrl',
      // 'sourceEventId',
      'channel',
      // 'sessionId',
      // 'marketid',
      'appId',
      'projectId'
      // 'appType',
      // 'seKeywords'
    ].join(',')} order by trackTime desc limit 1000`;

    const data = await this.slsService.query<{
      trackId: string;
      trackTime: number;
      durationTime: number;
      pageId: string;
      actionType: string;
      trackName: string;
      pageName: string;
      masterId?: string;
      channel?: string;
      referrerId?: string;
      sourceEventId?: string;
      id: string;
      projectId: string;
    }>({
      query,
      from: timeParam.dateStart,
      to: timeParam.dateEnd
    });

    if (!data.length) {
      return [];
    }

    let trackIdMap = {};
    let durationMasterIdMap = {};
    let channelMap = {};
    let checkoutMap = {};
    let projectMap = {};

    const newdata = data

      .map(item => {
        if (item.trackId === 'null') {
          if (item.actionType === 'DURATION') {
            durationMasterIdMap[item.masterId] = item;
          }
          return item;
        }
        item = clearNullStr(item);
        if (item.trackId) {
          trackIdMap[item.trackId] = {
            code: item.trackId,
            name: '',
            actionType: item.actionType,
            checkoutStatus: 1,
            projectId: Number(item.projectId)
          };
        }
        if (item.referrerId) {
          trackIdMap[item.referrerId] = {
            code: item.referrerId,
            name: '',
            actionType: item.actionType,
            checkoutStatus: 1
          };
        }
        if (item.sourceEventId) {
          trackIdMap[item.sourceEventId] = {
            code: item.sourceEventId,
            name: '',
            actionType: item.actionType,
            checkoutStatus: 1
          };
        }
        if (item.pageId) {
          trackIdMap[item.pageId] = { code: item.trackId, name: '', actionType: 'PAGE' };
        }

        checkoutMap[item.id] = { trackId: item.trackId, status: 1, logId: item.id };

        if (item.channel) {
          channelMap[item.channel] = { code: item.channel, name: '' };
        }
        if (item.projectId) {
          projectMap[item.projectId] = { id: item.projectId, name: '' };
        }

        return item;
      })
      .filter(item => item.actionType !== 'DURATION' && item.trackId !== 'null');

    const metadatas = await this.metadataService.getMetadatasByCodes(Object.keys(trackIdMap));
    metadatas.forEach(item => {
      trackIdMap[item.code] = item;
    });

    const projects = await this.projectService.getProjectsByIds(Object.keys(projectMap).map(item => Number(item)));
    projects.forEach(item => {
      projectMap[item.id] = item;
    });

    const checkoutLogs = await this.checkoutService.getCheckoutLogByLogIds(Object.keys(checkoutMap));
    checkoutLogs.forEach(item => {
      checkoutMap[item.id] = item;
    });

    const channels = await this.channelService.getChannelByCodes(Object.keys(channelMap));
    channels.forEach(item => {
      channelMap[item.channelId] = item;
    });
    const list = newdata.map(item => {
      return {
        ...item,
        channelInfo: channelMap[item.channel] || {},
        trackIdInfo: trackIdMap[item.trackId] || {},
        pageIdInfo: trackIdMap[item.pageId] || {},
        referrerInfo: trackIdMap[item.referrerId] || {},
        sourceEventInfo: trackIdMap[item.sourceEventId] || {},
        durationInfo: durationMasterIdMap[item.id] || {},
        checkoutInfo: checkoutMap[item.id] || {},
        projectInfo: projectMap[Number(item.projectId)] || {}
      };
    });
    return { list };
  }
}
