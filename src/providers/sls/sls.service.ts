import { Injectable } from '@nestjs/common';
import * as ALY from 'aliyun-sdk';
import { MetadataModel } from '@/modules/metadata/metadata.model';

const sls = new ALY.SLS({
  accessKeyId: 'LTAI4FiudjsTsY8LAAVH26CT', // 步骤2获取的密钥
  secretAccessKey: 'kjg3UU6oJeVHEZUx0sxS8rthXFP3XC', // 步骤2获取的密钥值
  endpoint: 'http://cn-hangzhou.sls.aliyuncs.com',
  apiVersion: '2015-06-01'
});

@Injectable()
export class SlsService {
  constructor() {}
  public query = function<T>(opt): Promise<T[]> {
    const newOpt = {
      projectName: 'ua-test',
      logStoreName: 'data',
      ...opt
    };
    return new Promise((resolve, reject) => {
      sls.getLogs(newOpt, function(error, data) {
        if (error) {
          reject(error);
        } else {
          resolve(Object.values(data.body));
        }
      });
    });
  };

  public queryMetadata = async function(metadata: MetadataModel) {
    const opt = {
      query: `trackId : "${metadata.code}"|SELECT COUNT(*) as pv`,
      from: Math.floor(new Date(metadata.createdAt).getTime() / 1000),
      to: Math.floor(Date.now() / 1000)
    };

    const all = await this.query(opt);
    opt.from = Math.floor((Date.now() - 86400000 * 3) / 1000);
    const recent = await this.query(opt);

    return {
      all: Number(all[0].pv),
      recent: Number(recent[0].pv)
    };
  };

  public queryEventValues = async function(key) {
    const opt = {
      // tslint:disable-next-line: max-line-length
      query: `* | select "${key}" , pv from( select count(1) as pv , "${key}" from (select "${key}" from log limit 100000) group by "${key}" order by pv desc) order by pv desc limit 10`,
      from: Math.floor(Date.now() / 1000 - 86400 * 30),
      to: Math.floor(Date.now() / 1000)
    };
    const result = await this.query(opt);

    return result.map(item => item[key]);
  };
}
