import { Injectable } from '@nestjs/common';
import * as ALY from 'aliyun-sdk';
import { SLS_CONFIG, SLS_STORE_CONFIG } from '../../app.config';

const sls = new ALY.SLS({
  ...SLS_CONFIG
});

@Injectable()
export class SlsService {
  constructor() {}
  public query = function<T>(opt): Promise<T[]> {
    const newOpt = {
      ...SLS_STORE_CONFIG,
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
