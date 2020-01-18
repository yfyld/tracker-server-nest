import { Injectable } from '@nestjs/common';
import * as ALY from 'aliyun-sdk';

const sls = new ALY.SLS({
  accessKeyId: 'LTAI4FiudjsTsY8LAAVH26CT', // 步骤2获取的密钥
  secretAccessKey: 'kjg3UU6oJeVHEZUx0sxS8rthXFP3XC', // 步骤2获取的密钥值
  endpoint: 'http://cn-hangzhou.sls.aliyuncs.com',
  apiVersion: '2015-06-01'
});

@Injectable()
export class SlsService {
  constructor() {}
  public query = function(opt) {
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
          resolve(data);
        }
      });
    });
  };
}
