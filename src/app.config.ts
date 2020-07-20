import { MysqlConnectionOptions } from 'typeorm/driver/mysql/MysqlConnectionOptions';
import * as path from 'path';

export const opsConfig = require('./configs/ops.config.dev');

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

export const CRYPTO_KEY = 'ks@123';

export const CROSS_DOMAIN = {
  allowedOrigins: []
};

export const BULLCONFIG = {};

export const CCONFIG = {};

export const MULTER_OPTIONS = {
  fileSize: 10000000,
  path: path.join(__dirname, 'public/uploads')
};

export const ALARMCONFIG = {
  alarmWithlevelType: [1, 10, 100]
};

export const STAT_USER_NUM_INTERVAL = 30000;
export const ALARM_INTERVAL = 30000;
export const GENERATE_IMG_CRON = '0 0 11 * *';

export const BASE_URL = {
  webUrl: 'http://test.qa.91jkys.com:3000',
  serverUrl: 'http://test.qa.91jkys.com:7009'
};

export const COOKIE_HOST = 'qa.91jkys.com';

export const ORMCONFIG: MysqlConnectionOptions = {
  type: 'mysql',
  ...opsConfig.db,
  database: 'telescope',
  entities: [__dirname + '/**/*.model{.ts,.js}'],
  synchronize: true
};

export const REDIS = {
  ...opsConfig.redis
};

export const ES_CONFIG = {
  host: '127.0.0.1:7002',
  log: 'trace'
};

export const LOGGER_CONFIG = {
  path: path.join(__dirname, '../logs/telescope-'),
  daysToKeep: 30,
  pattern: 'yyyy-MM-dd.log',
  level: 'debug'
};

export const SLS_CONFIG = {
  ...opsConfig.sls
};

export const SLS_STORE_CONFIG = { ...opsConfig.slsLogStroe };
