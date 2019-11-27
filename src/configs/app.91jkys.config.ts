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

export const MULTER_OPTIONS = {
  fileSize: 10000000,
  path: path.join(__dirname, 'publics/uploads')
};

export const STAT_USER_NUM_INTERVAL = 30000;
export const ALARM_INTERVAL = 30000;
export const GENERATE_IMG_CRON = '0 0 11 * *';

export const BASE_URL = {
  webUrl: 'http://telescope.qa.91jkys.com',
  serverUrl: 'http://telescope.qa.91jkys.com/api'
};

const opsConfig = require('./config/ops.config');

export const ORMCONFIG: MysqlConnectionOptions = {
  type: 'mysql',
  ...opsConfig,
  database: 'telescope',
  entities: [__dirname + '/**/*.model{.ts,.js}'],
  synchronize: true
};

const redisConfig = require('/data/www/91jkys/config/redis');
export const REDIS = {
  redisConfig,
  db: 10
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
