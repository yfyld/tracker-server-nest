import { MysqlConnectionOptions } from 'typeorm/driver/mysql/MysqlConnectionOptions';
import * as path from 'path';

export const APP = {
  port: 7009,
  version: '1.0.0'
};

export const AUTH = {
  jwtTokenSecret: 'I am quiet handsome man',
  expiresIn: 99999999999999,
  defaultPassword: '123456',
  data: { username: 'root', roles: [] }
};

export const CROSS_DOMAIN = {
  allowedOrigins: []
};

export const BULLCONFIG = {};

export const CCONFIG = {};

export const MULTER_OPTIONS = {
  fileSize: 10000000,
  path: path.join(__dirname, 'publics/uploads')
};

export const ALARMCONFIG = {
  alarmWithlevelType: [1, 10, 100]
};

export const STAT_USER_NUM_INTERVAL = 30000;
export const ALARM_INTERVAL = 30000;
export const GENERATE_IMG_CRON = '0 0 11 * *';

export const BASE_URL = {
  webUrl: 'http://127.0.0.1:5000',
  serverUrl: 'http://127.0.0.1:7009'
};

const opsConfig = require('./ops.config');

export const ORMCONFIG: MysqlConnectionOptions = {
  type: 'mysql',
  host: '172.16.50.10',
  ...opsConfig,
  database: 'telescope',
  entities: [__dirname + '/**/*.model{.ts,.js}'],
  synchronize: true
};

export const REDIS = {
  host: '127.0.0.1',
  port: 7008,
  ttl: null,
  defaultCacheTTL: 60 * 60 * 24
};

export const ES_CONFIG = {
  host: '127.0.0.1:7002',
  log: 'trace'
};
