import { Injectable } from '@nestjs/common';
import * as ALY from 'aliyun-sdk';

const sls = new ALY.SLS({
  accessKeyId: 'ofWq93H8YAwfeN9F', // 步骤2获取的密钥
  secretAccessKey: '1IV52wLzNLZbm8hD1N9Mfle3XyYfjq', // 步骤2获取的密钥值
  endpoint: 'http://cn-hangzhou.sls.aliyuncs.com',
  apiVersion: '2015-06-01'
});

@Injectable()
export class SlsService {
  constructor() {}
  public query = function<T>(opt): Promise<T[]> {
    const newOpt = {
      projectName: 'k8s-log-custom-ks-qa',
      logStoreName: 'frontlo-collection-telescope-process-qa',
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
}
