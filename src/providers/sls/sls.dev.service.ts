import { Injectable } from '@nestjs/common';
import * as ALY from 'aliyun-sdk';
import { SLS_CONFIG, DEV_LOG_CONFIG } from '../../app.config';

const sls = new ALY.SLS({
  ...SLS_CONFIG
});

@Injectable()
export class SlsDevService {
  constructor() {}
  public query = function<T>(opt, fixTime = true): Promise<T[]> {
    const { query, from, to } = opt;

    const newOpt = {
      ...DEV_LOG_CONFIG,
      query,
      from: Math.floor(from / 1000),
      to: Math.floor(to / 1000)
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
