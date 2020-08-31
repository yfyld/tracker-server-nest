import { IPathData } from './analyse.interface';
import { SlsService } from '@/providers/sls/sls.service';
import { Injectable } from '@nestjs/common';
import { QueryPathAnalyseDataDto } from './analyse.dto';
import { filterToQuery, getProjectFilter } from './analyse.util';
import { getDynamicTime } from '@/utils/date';
import { MetadataService } from '../metadata/metadata.service';
import { ProjectService } from '../project/project.service';

@Injectable()
export class AnalysePathService {
  constructor(
    private readonly slsService: SlsService,
    private readonly metadataService: MetadataService,
    private readonly projectService: ProjectService
  ) {}

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
      const filterStr = `${globalFilterStr} ${indicatorFilterStr} ${getProjectFilter(
        param.projectId,
        indicator.projectId,
        associationProjectIds
      )} ${metadataStr} `;
      const query = `${filterStr} |${select}`;

      indicatorSqlMap[indicator.id] = query;

      const data = await this.slsService.query<any>({
        query,
        from: timeParam.dateStart,
        to: timeParam.dateEnd
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
          from: timeParam.dateStart,
          to: timeParam.dateEnd
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
