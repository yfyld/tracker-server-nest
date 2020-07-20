import { Injectable } from '@nestjs/common';
import * as ALY from 'aliyun-sdk';
import { SLS_CONFIG, SLS_STORE_CONFIG } from '../../app.config';

const sls = new ALY.SLS({
  ...SLS_CONFIG
});

export interface IQueryParams {
  query: string;
  from?: number;
  to?: number;
}

@Injectable()
export class SlsService {
  constructor() {}
  public query = function<T>(opt): Promise<T[]> {
    const { query, from, to } = opt;

    const newOpt = {
      ...SLS_STORE_CONFIG,
      query: query.replace(/(^.+)(\|.*)/, ($, $1, $2) => {
        return `trackTime<${to} and trackTime>${from} and (${$1})${$2}`;
      }),
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
