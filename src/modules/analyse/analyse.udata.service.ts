import { UserModel } from './../user/user.model';
import { JwtService } from '@nestjs/jwt';

import { SlsService } from '@/providers/sls/sls.service';
import { Injectable } from '@nestjs/common';

import { filterToQuery, getProjectFilter } from './analyse.util';
import { getDynamicTime } from '@/utils/date';
import { MetadataService } from '../metadata/metadata.service';
import { ProjectService } from '../project/project.service';

@Injectable()
export class AnalyseUdataService {
  constructor(
    private readonly slsService: SlsService,
    private readonly metadataService: MetadataService,
    private readonly projectService: ProjectService,
    private readonly jwtService: JwtService
  ) {}

  public async getToken(projectIds: number[], user: UserModel) {
    return this.jwtService.sign({
      projectIds,
      user,
      expiresIn: '1800s'
    });
  }

  /**
   * 路径分析service
   * @param QueryUdataAnalyseDataDto
   */
  public async udataAnalyse(param: any): Promise<any> {
    const tokenInfo = this.jwtService.verify(param.token);

    const result = this.slsService.query({});
    return result;
  }
}
